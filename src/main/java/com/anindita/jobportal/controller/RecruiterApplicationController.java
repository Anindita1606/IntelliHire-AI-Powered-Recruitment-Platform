package com.anindita.jobportal.controller;

import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.anindita.jobportal.dto.ApplicationResponse;
import com.anindita.jobportal.entity.ApplicationStatus;
import com.anindita.jobportal.service.RecruiterApplicationService;

@RestController
@RequestMapping("/recruiter/applications")
public class RecruiterApplicationController {

    private final RecruiterApplicationService recruiterApplicationService;

    public RecruiterApplicationController(
            RecruiterApplicationService recruiterApplicationService) {

        this.recruiterApplicationService =
                recruiterApplicationService;
    }

    @GetMapping("/job/{jobId}")
    public List<ApplicationResponse> getApplicants(
            @PathVariable Long jobId,
            Authentication authentication) {

        return recruiterApplicationService.getApplicants(
                jobId,
                authentication
        );
    }

    @PutMapping("/{applicationId}/status")
    public ApplicationResponse updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestParam ApplicationStatus status,
            Authentication authentication) {

        return recruiterApplicationService
                .updateApplicationStatus(
                        applicationId,
                        status,
                        authentication
                );
    }

    @GetMapping("/{applicationId}/resume")
    public ResponseEntity<Resource> downloadResume(
            @PathVariable Long applicationId,
            Authentication authentication) {

        return recruiterApplicationService.downloadResume(
                applicationId,
                authentication
        );
    }
}