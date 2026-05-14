package com.anindita.jobportal.controller;

import java.util.Collections;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

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

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private RoleRepository roleRepo;

    @Autowired
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder encoder =
            new BCryptPasswordEncoder();

    @PostMapping("/register")
    public String register(
            @RequestBody RegisterRequest request) {

        User user = new User();

        user.setFullName(request.getFullName());

        user.setEmail(request.getEmail());

        user.setPassword(
                encoder.encode(request.getPassword())
        );

        Role candidateRole = roleRepo
                .findByName("CANDIDATE")
                .orElseThrow();

        user.setRoles(
                Collections.singleton(candidateRole)
        );

        userRepo.save(user);

        return "User Registered Successfully";
    }

    @PostMapping("/login")
    public Map<String, String> login(
            @RequestBody LoginRequest request) {

        User user = userRepo.findByEmail(
                request.getEmail()
        ).orElseThrow();

        if (encoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {

            String token =
                    jwtUtil.generateToken(user.getEmail());

            return Map.of("token", token);
        }

        throw new RuntimeException(
                "Invalid Credentials"
        );
    }
}