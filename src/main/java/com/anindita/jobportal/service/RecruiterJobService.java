package com.anindita.jobportal.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.anindita.jobportal.entity.Role;
import com.anindita.jobportal.entity.Job;
import com.anindita.jobportal.entity.User;
import com.anindita.jobportal.repository.JobRepository;
import com.anindita.jobportal.repository.UserRepository;

@Service
public class RecruiterJobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public RecruiterJobService(
            JobRepository jobRepository,
            UserRepository userRepository) {

        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<Job> getMyJobs(
            Authentication authentication) {

        User recruiter = getAuthenticatedRecruiter(authentication);

        return jobRepository
                .findByRecruiterIdOrderByIdDesc(
                        recruiter.getId()
                );
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
                    "Only recruiter accounts can access recruiter jobs."
            );
        }

        return recruiter;
    }
}