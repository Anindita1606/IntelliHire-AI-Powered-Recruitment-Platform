package com.anindita.jobportal.controller;

import java.util.List;
import java.util.Map;

import jakarta.validation.Valid;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.anindita.jobportal.dto.ApplicationRequest;
import com.anindita.jobportal.dto.ApplicationResponse;
import com.anindita.jobportal.service.ApplicationService;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(
            ApplicationService applicationService) {

        this.applicationService =
                applicationService;
    }

    @PostMapping(
            value = "/{jobId}",
            consumes = "multipart/form-data"
    )
    public Map<String, Long> applyForJob(
            @PathVariable Long jobId,
            @Valid @ModelAttribute ApplicationRequest request,
            Authentication authentication) {

        return applicationService.applyForJob(
                jobId,
                request,
                authentication
        );
    }

    @GetMapping("/my")
    public List<ApplicationResponse> getMyApplications(
            Authentication authentication) {

        return applicationService.getMyApplications(
                authentication
        );
    }
}