package com.anindita.jobportal.dto;

import java.time.LocalDateTime;

import com.anindita.jobportal.entity.ApplicationStatus;

public class ApplicationResponse {

    private Long id;

    private JobSummary job;

    private CandidateSummary candidate;

    private String phone;
    private String location;
    private String education;
    private String experience;
    private String skills;
    private String coverLetter;
    private String resumeFileName;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;

    public ApplicationResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public JobSummary getJob() {
        return job;
    }

    public void setJob(JobSummary job) {
        this.job = job;
    }

    public CandidateSummary getCandidate() {
        return candidate;
    }

    public void setCandidate(CandidateSummary candidate) {
        this.candidate = candidate;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getCoverLetter() {
        return coverLetter;
    }

    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }

    public String getResumeFileName() {
        return resumeFileName;
    }

    public void setResumeFileName(String resumeFileName) {
        this.resumeFileName = resumeFileName;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }

    // =========================
    // JOB SUMMARY
    // =========================

    public static class JobSummary {

        private Long id;
        private String title;
        private String company;
        private String location;
        private double salary;
        private String description;

        public JobSummary() {
        }

        public JobSummary(
                Long id,
                String title,
                String company,
                String location,
                double salary,
                String description) {

            this.id = id;
            this.title = title;
            this.company = company;
            this.location = location;
            this.salary = salary;
            this.description = description;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getCompany() {
            return company;
        }

        public void setCompany(String company) {
            this.company = company;
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }

        public double getSalary() {
            return salary;
        }

        public void setSalary(double salary) {
            this.salary = salary;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }

    // =========================
    // CANDIDATE SUMMARY
    // =========================

    public static class CandidateSummary {

        private Long id;
        private String fullName;
        private String email;

        public CandidateSummary() {
        }

        public CandidateSummary(
                Long id,
                String fullName,
                String email) {

            this.id = id;
            this.fullName = fullName;
            this.email = email;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }
}