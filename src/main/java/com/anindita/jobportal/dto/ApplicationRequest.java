package com.anindita.jobportal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;

public class ApplicationRequest {

    @NotBlank
    @Size(max = 20)
    private String phone;

    @NotBlank
    @Size(max = 100)
    private String location;

    @NotBlank
    @Size(max = 200)
    private String education;

    @Size(max = 100)
    private String experience;

    @Size(max = 1000)
    private String skills;

    @Size(max = 3000)
    private String coverLetter;

    @NotNull
    private MultipartFile resume;

    public ApplicationRequest() {
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

    public MultipartFile getResume() {
        return resume;
    }

    public void setResume(MultipartFile resume) {
        this.resume = resume;
    }
}
