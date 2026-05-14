package com.anindita.jobportal.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.anindita.jobportal.entity.Job;
import com.anindita.jobportal.repository.JobRepository;

@RestController
@RequestMapping("/jobs")
public class JobController {

    @Autowired
    private JobRepository jobRepo;

    @PostMapping
    public Job createJob(
            @RequestBody Job job) {

        return jobRepo.save(job);
    }

    @GetMapping
    public List<Job> getAllJobs() {

        return jobRepo.findAll();
    }
}