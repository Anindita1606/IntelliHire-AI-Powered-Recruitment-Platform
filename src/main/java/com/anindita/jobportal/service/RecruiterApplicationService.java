package com.anindita.jobportal.service;

import java.io.IOException;
import java.nio.file.Files;
import java.util.List;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.anindita.jobportal.dto.ApplicationResponse;
import com.anindita.jobportal.dto.ApplicationResponseMapper;
import com.anindita.jobportal.entity.Application;
import com.anindita.jobportal.entity.ApplicationStatus;
import com.anindita.jobportal.entity.Job;
import com.anindita.jobportal.entity.Role;
import com.anindita.jobportal.entity.User;
import com.anindita.jobportal.repository.ApplicationRepository;
import com.anindita.jobportal.repository.JobRepository;
import com.anindita.jobportal.repository.UserRepository;

@Service
public class RecruiterApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ResumeStorageService resumeStorageService;
    private final ApplicationResponseMapper applicationResponseMapper;

    public RecruiterApplicationService(
            ApplicationRepository applicationRepository,
            JobRepository jobRepository,
            UserRepository userRepository,
            ResumeStorageService resumeStorageService,
            ApplicationResponseMapper applicationResponseMapper) {

        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.resumeStorageService = resumeStorageService;
        this.applicationResponseMapper = applicationResponseMapper;
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getApplicants(
            Long jobId,
            Authentication authentication) {

        User recruiter = getAuthenticatedRecruiter(authentication);

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Job not found."
                ));

        requireOwnership(job, recruiter);

        return applicationRepository
                .findByJobIdOrderByAppliedAtDesc(jobId)
                .stream()
                .map(applicationResponseMapper::toResponse)
                .toList();
    }

    @Transactional
    public ApplicationResponse updateApplicationStatus(
            Long applicationId,
            ApplicationStatus status,
            Authentication authentication) {

        if (status == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Application status is required."
            );
        }

        User recruiter = getAuthenticatedRecruiter(authentication);

        Application application = applicationRepository
                .findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Application not found."
                ));

        requireOwnership(application.getJob(), recruiter);

        application.setStatus(status);

        Application saved =
                applicationRepository.save(application);

        return applicationResponseMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Resource> downloadResume(
            Long applicationId,
            Authentication authentication) {

        User recruiter = getAuthenticatedRecruiter(authentication);

        Application application = applicationRepository
                .findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Application not found."
                ));

        requireOwnership(application.getJob(), recruiter);

        ResumeStorageService.StoredFile storedFile =
                resumeStorageService.load(
                        application.getResumeFilePath()
                );

        String filename = application.getResumeFileName();

        if (filename == null || filename.isBlank()) {
            filename = "resume.pdf";
        }

        try {
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .contentLength(Files.size(storedFile.path()))
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            ContentDisposition.attachment()
                                    .filename(filename)
                                    .build()
                                    .toString()
                    )
                    .body(
                            new FileSystemResource(
                                    storedFile.path()
                            )
                    );

        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "The resume file could not be read."
            );
        }
    }

    private User getAuthenticatedRecruiter(
            Authentication authentication) {

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication.getName() == null) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Authentication is required."
            );
        }

        User recruiter = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Recruiter account was not found."
                ));

        boolean isRecruiter =
                recruiter.getRoles() != null
                && recruiter.getRoles()
                        .stream()
                        .map(Role::getName)
                        .anyMatch("EMPLOYER"::equals);

        if (!isRecruiter) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only recruiter accounts can access applications."
            );
        }

        return recruiter;
    }

    private static void requireOwnership(
            Job job,
            User recruiter) {

        if (job == null
                || job.getRecruiter() == null
                || !job.getRecruiter()
                        .getId()
                        .equals(recruiter.getId())) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only access applications for your own jobs."
            );
        }
    }
}