package com.anindita.jobportal.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(
    name = "applications",
    uniqueConstraints = {
        @UniqueConstraint(
            columnNames = {"job_id", "candidate_id"}
        )
    }
)
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Job being applied for
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    // Logged-in candidate
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidate_id", nullable = false)
    private User candidate;

    // Application form details
    @Column(nullable = false, length = 20)
    private String phone;

    @Column(nullable = false, length = 100)
    private String location;

    @Column(nullable = false, length = 200)
    private String education;

    @Column(length = 100)
    private String experience;

    @Column(length = 1000)
    private String skills;

    @Column(length = 3000)
    private String coverLetter;

    // Resume file information
    @Column(length = 500)
    private String resumeFileName;

    @Column(length = 1000)
    @JsonIgnore
    private String resumeFilePath;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    @Column(nullable = false)
    private LocalDateTime appliedAt;

    @PrePersist
    protected void onCreate() {
        appliedAt = LocalDateTime.now();
    }

    public Application() {
    }

    // =========================
    // GETTERS AND SETTERS
    // =========================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Job getJob() {
        return job;
    }

    public void setJob(Job job) {
        this.job = job;
    }

    public User getCandidate() {
        return candidate;
    }

    public void setCandidate(User candidate) {
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

    public String getResumeFilePath() {
        return resumeFilePath;
    }

    public void setResumeFilePath(String resumeFilePath) {
        this.resumeFilePath = resumeFilePath;
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
}
