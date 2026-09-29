package com.anindita.jobportal.service;

import java.util.List;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.anindita.jobportal.dto.ApplicationRequest;
import com.anindita.jobportal.dto.ApplicationResponse;
import com.anindita.jobportal.dto.ApplicationResponseMapper;
import com.anindita.jobportal.entity.Application;
import com.anindita.jobportal.entity.Job;
import com.anindita.jobportal.entity.Role;
import com.anindita.jobportal.entity.User;
import com.anindita.jobportal.repository.ApplicationRepository;
import com.anindita.jobportal.repository.JobRepository;
import com.anindita.jobportal.repository.UserRepository;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ResumeStorageService resumeStorageService;
    private final ApplicationResponseMapper applicationResponseMapper;

    public ApplicationService(
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

    @Transactional
    public Map<String, Long> applyForJob(
            Long jobId,
            ApplicationRequest request,
            Authentication authentication) {

        User candidate = getAuthenticatedCandidate(authentication);

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "This job is no longer available."
                ));

        if (applicationRepository
                .findByJobIdAndCandidateId(
                        jobId,
                        candidate.getId()
                )
                .isPresent()) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "You have already applied for this job."
            );
        }

        ResumeStorageService.StoredResume storedResume = null;

        try {

            storedResume = resumeStorageService.store(
                    request.getResume()
            );

            Application application = new Application();

            application.setJob(job);
            application.setCandidate(candidate);

            application.setPhone(request.getPhone().trim());
            application.setLocation(request.getLocation().trim());
            application.setEducation(request.getEducation().trim());

            application.setExperience(
                    trimToNull(request.getExperience())
            );

            application.setSkills(
                    trimToNull(request.getSkills())
            );

            application.setCoverLetter(
                    trimToNull(request.getCoverLetter())
            );

            application.setResumeFileName(
                    storedResume.originalFileName()
            );

            application.setResumeFilePath(
                    storedResume.path().toString()
            );

            Application saved =
                    applicationRepository.saveAndFlush(application);

            return Map.of("id", saved.getId());

        } catch (DataIntegrityViolationException e) {

            resumeStorageService.deleteQuietly(storedResume);

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "You have already applied for this job."
            );

        } catch (RuntimeException e) {

            resumeStorageService.deleteQuietly(storedResume);

            throw e;
        }
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getMyApplications(
            Authentication authentication) {

        User candidate = getAuthenticatedCandidate(authentication);

        return applicationRepository
                .findByCandidateIdOrderByAppliedAtDesc(
                        candidate.getId()
                )
                .stream()
                .map(applicationResponseMapper::toResponse)
                .toList();
    }

    private User getAuthenticatedCandidate(
            Authentication authentication) {

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication.getName() == null) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Authentication is required."
            );
        }

        User candidate = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Candidate account was not found."
                ));

        boolean isCandidate = candidate.getRoles() != null
                && candidate.getRoles()
                        .stream()
                        .map(Role::getName)
                        .anyMatch("CANDIDATE"::equals);

        if (!isCandidate) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only candidate accounts can apply for jobs."
            );
        }

        return candidate;
    }

    private static String trimToNull(String value) {

        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }
}