package com.anindita.jobportal.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Job {

    @Id
    @GeneratedValue(strategy =
            GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 150)
    private String title;

    @NotBlank
    @Size(max = 150)
    private String company;

    @NotBlank
    @Size(max = 150)
    private String location;

    @DecimalMin("0.0")
    private double salary;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruiter_id")
    @JsonIgnore
    private User recruiter;

    @NotBlank
    @Column(length = 2000)
    @Size(max = 2000)
    private String description;

    public Job() {
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
    public User getRecruiter() {
        return recruiter;
    }

    public void setRecruiter(User recruiter) {
        this.recruiter = recruiter;
    }
}
