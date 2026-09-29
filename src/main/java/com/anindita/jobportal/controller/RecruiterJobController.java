package com.anindita.jobportal.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.anindita.jobportal.entity.Job;
import com.anindita.jobportal.service.RecruiterJobService;

@RestController
@RequestMapping("/recruiter/jobs")
public class RecruiterJobController {

    private final RecruiterJobService recruiterJobService;

    public RecruiterJobController(
            RecruiterJobService recruiterJobService) {

        this.recruiterJobService = recruiterJobService;
    }

    @GetMapping
    public List<Job> getMyJobs(
            Authentication authentication) {

        return recruiterJobService.getMyJobs(
                authentication
        );
    }
}