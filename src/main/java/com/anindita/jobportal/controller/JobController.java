package com.anindita.jobportal.controller;

import java.util.List;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.anindita.jobportal.entity.Job;
import com.anindita.jobportal.entity.User;
import com.anindita.jobportal.repository.ApplicationRepository;
import com.anindita.jobportal.repository.JobRepository;
import com.anindita.jobportal.repository.UserRepository;

@RestController
@RequestMapping("/jobs")
public class JobController {

    @Autowired
    private JobRepository jobRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ApplicationRepository applicationRepo;

    // Public - anyone can browse jobs
    @GetMapping
    public List<Job> getAllJobs() {
        return jobRepo.findAll();
    }

    // Public - anyone can view a job
    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {

        return jobRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Employer only - recruiter is taken from logged-in user
    @PostMapping
    public ResponseEntity<Job> createJob(
            @Valid @RequestBody Job job,
            Authentication authentication) {

        String email = authentication.getName();

        User recruiter = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Recruiter not found"));

        job.setRecruiter(recruiter);
        // Never let a request-supplied ID turn job creation into an update.
        job.setId(null);
        job.setTitle(job.getTitle().trim());
        job.setCompany(job.getCompany().trim());
        job.setLocation(job.getLocation().trim());
        job.setDescription(job.getDescription().trim());

        Job savedJob = jobRepo.save(job);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedJob);
    }

    // Employer only - update own job
    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody Job updatedJob,
            Authentication authentication) {

        String email = authentication.getName();

        User recruiter = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Recruiter not found"));

        Job existingJob = jobRepo.findById(id).orElse(null);
        if (existingJob == null) {
            return ResponseEntity.notFound().build();
        }
        if (existingJob.getRecruiter() == null
                || !existingJob.getRecruiter().getId().equals(recruiter.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        existingJob.setTitle(updatedJob.getTitle().trim());
        existingJob.setCompany(updatedJob.getCompany().trim());
        existingJob.setLocation(updatedJob.getLocation().trim());
        existingJob.setSalary(updatedJob.getSalary());
        existingJob.setDescription(updatedJob.getDescription().trim());
        return ResponseEntity.ok(jobRepo.save(existingJob));
    }

    // Employer only - delete own job
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();

        User recruiter = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Recruiter not found"));

        Job job = jobRepo.findById(id).orElse(null);
        if (job == null) {
            return ResponseEntity.notFound().build();
        }
        if (job.getRecruiter() == null
                || !job.getRecruiter().getId().equals(recruiter.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if (applicationRepo.countByJobId(id) > 0) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        jobRepo.delete(job);
        return ResponseEntity.noContent().build();
    }
}
