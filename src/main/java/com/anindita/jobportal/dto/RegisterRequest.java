package com.anindita.jobportal.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank
    @Size(max = 30)
    private String fullName;
    @NotBlank
    @Email
    @Size(max = 100)
    private String email;
    @NotBlank
    @Size(min = 8, max = 72)
    private String password;
    @Pattern(regexp = "CANDIDATE|EMPLOYER")
    private String role = "CANDIDATE";

    public RegisterRequest() {
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role == null ? null : role.trim().toUpperCase(java.util.Locale.ROOT);
    }
}
