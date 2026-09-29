package com.anindita.jobportal.controller;

import java.util.Collections;
import java.util.Locale;
import java.util.Map;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.anindita.jobportal.dto.LoginRequest;
import com.anindita.jobportal.dto.RegisterRequest;
import com.anindita.jobportal.entity.Role;
import com.anindita.jobportal.entity.User;
import com.anindita.jobportal.repository.RoleRepository;
import com.anindita.jobportal.repository.UserRepository;
import com.anindita.jobportal.security.JwtUtil;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            UserRepository userRepo,
            RoleRepository roleRepo,
            JwtUtil jwtUtil,
            PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public Map<String, String> register(
            @Valid @RequestBody RegisterRequest request) {

        String email = normalizeEmail(request.getEmail());
        if (userRepo.existsByEmail(email)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "An account with this email already exists.");
        }

        String requestedRole = request.getRole() == null
                ? "CANDIDATE"
                : request.getRole();
        if (!requestedRole.equals("CANDIDATE")
                && !requestedRole.equals("EMPLOYER")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Choose a candidate or employer account.");
        }

        Role role = roleRepo.findByName(requestedRole)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "The selected account role is not configured."));

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(Collections.singleton(role));
        userRepo.save(user);

        return Map.of("message", "Account created successfully.");
    }

    @PostMapping("/login")
    public Map<String, String> login(
            @Valid @RequestBody LoginRequest request) {

        String email = normalizeEmail(request.getEmail());
        User user = userRepo.findByEmail(email)
                .orElseThrow(AuthController::invalidCredentials);

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw invalidCredentials();
        }

        return Map.of("token", jwtUtil.generateToken(user.getEmail()));
    }

    @GetMapping("/me")
    public Map<String, Object> getCurrentUser(Authentication authentication) {
        User user = userRepo.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "The authenticated account no longer exists."));

        String role = user.getRoles().stream()
                .map(Role::getName)
                .findFirst()
                .orElse("CANDIDATE");

        return Map.of(
                "id", user.getId(),
                "name", user.getFullName(),
                "email", user.getEmail(),
                "role", role);
    }

    private static String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private static ResponseStatusException invalidCredentials() {
        return new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Email or password is incorrect.");
    }
}
