package com.anindita;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Stream;

import com.anindita.jobportal.JobPortalProjectApplication;
import com.anindita.jobportal.config.AppConfig;
import com.anindita.jobportal.config.SecurityConfig;
import com.anindita.jobportal.controller.ApplicationController;
import com.anindita.jobportal.controller.AuthController;
import com.anindita.jobportal.controller.JobController;
import com.anindita.jobportal.entity.Application;
import com.anindita.jobportal.entity.Job;
import com.anindita.jobportal.entity.Role;
import com.anindita.jobportal.entity.User;
import com.anindita.jobportal.repository.ApplicationRepository;
import com.anindita.jobportal.repository.JobRepository;
import com.anindita.jobportal.repository.RoleRepository;
import com.anindita.jobportal.repository.UserRepository;
import com.anindita.jobportal.security.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = {ApplicationController.class, AuthController.class, JobController.class})
@ContextConfiguration(classes = JobPortalProjectApplication.class)
@Import({SecurityConfig.class, AppConfig.class, JwtUtil.class})
class JobPortalProjectApplicationTests {

    private static final String CANDIDATE_EMAIL = "candidate.flow@example.test";
    private static final String CANDIDATE_PASSWORD = "candidate-password";
    private static final String TEST_JWT_SECRET = "intellihire-test-jwt-secret-0123456789-abcdef";
    private static final Path TEST_UPLOAD_DIR = Path.of(
            System.getProperty("java.io.tmpdir"),
            "intellihire-candidate-flow-" + UUID.randomUUID());

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ApplicationRepository applicationRepository;

    @MockBean
    private JobRepository jobRepository;

    @MockBean
    private RoleRepository roleRepository;

    @MockBean
    private UserRepository userRepository;

    private final AtomicReference<Application> savedApplication = new AtomicReference<>();
    private User candidate;

    @DynamicPropertySource
    static void testProperties(DynamicPropertyRegistry registry) {
        registry.add("intellihire.resume-upload-dir", TEST_UPLOAD_DIR::toString);
        registry.add("intellihire.jwt.secret", () -> TEST_JWT_SECRET);
    }

    @BeforeEach
    void setUp() throws Exception {
        savedApplication.set(null);

        Role candidateRole = new Role("CANDIDATE");
        candidate = new User();
        candidate.setId(41L);
        candidate.setFullName("Flow Test Candidate");
        candidate.setEmail(CANDIDATE_EMAIL);
        candidate.setPassword(passwordEncoder.encode(CANDIDATE_PASSWORD));
        candidate.setRoles(Set.of(candidateRole));

        Job job = new Job();
        job.setId(7L);
        job.setTitle("Java Engineer");
        job.setCompany("Example Ltd");
        job.setLocation("Remote");
        job.setSalary(800000);
        job.setDescription("Build backend services.");

        when(userRepository.findByEmail(CANDIDATE_EMAIL)).thenReturn(Optional.of(candidate));
        when(jobRepository.findAll()).thenReturn(List.of(job));
        when(jobRepository.findById(7L)).thenReturn(Optional.of(job));
        when(applicationRepository.findByJobIdAndCandidateId(7L, 41L)).thenReturn(Optional.empty());
        when(applicationRepository.save(any(Application.class))).thenAnswer(invocation -> {
            Application application = invocation.getArgument(0);
            application.setId(501L);
            savedApplication.set(application);
            return application;
        });
        when(applicationRepository.findByCandidateIdOrderByAppliedAtDesc(41L)).thenAnswer(
                invocation -> savedApplication.get() == null
                        ? List.of()
                        : List.of(savedApplication.get()));
    }

    @Test
    void candidateCanSignInBrowseApplyWithPdfAndSeeApplicationOnDashboard() throws Exception {
        String loginResponse = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + CANDIDATE_EMAIL
                                + "\",\"password\":\"" + CANDIDATE_PASSWORD + "\"}"))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        String token = objectMapper.readTree(loginResponse).get("token").asText();

        mockMvc.perform(get("/auth/me")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(CANDIDATE_EMAIL))
                .andExpect(jsonPath("$.role").value("CANDIDATE"));

        mockMvc.perform(get("/jobs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(7))
                .andExpect(jsonPath("$[0].title").value("Java Engineer"));

        mockMvc.perform(get("/jobs/7"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.company").value("Example Ltd"));

        mockMvc.perform(get("/applications/my"))
                .andExpect(status().isUnauthorized());

        MockMultipartFile resume = new MockMultipartFile(
                "resume",
                "candidate-resume.pdf",
                "application/pdf",
                "%PDF-1.4\nFlow test resume\n".getBytes(StandardCharsets.US_ASCII));

        mockMvc.perform(multipart("/applications/7")
                        .file(resume)
                        .param("phone", "1234567890")
                        .param("location", "Kolkata")
                        .param("education", "B.Tech")
                        .param("experience", "Fresher")
                        .param("skills", "Java, Spring Boot")
                        .param("coverLetter", "I am interested in this role.")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(501));

        mockMvc.perform(get("/applications/my")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(501))
                .andExpect(jsonPath("$[0].status").value("APPLIED"))
                .andExpect(jsonPath("$[0].job.title").value("Java Engineer"))
                .andExpect(jsonPath("$[0].candidate.fullName").value("Flow Test Candidate"))
                .andExpect(jsonPath("$[0].candidate.password").doesNotExist())
                .andExpect(jsonPath("$[0].resumeFilePath").doesNotExist());
    }

    @AfterAll
    static void cleanTemporaryResume() throws IOException {
        if (Files.exists(TEST_UPLOAD_DIR)) {
            try (Stream<Path> files = Files.walk(TEST_UPLOAD_DIR)) {
                for (Path file : files.sorted((left, right) -> right.compareTo(left)).toList()) {
                    Files.deleteIfExists(file);
                }
            }
        }
    }
}
