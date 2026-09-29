package com.anindita.jobportal.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.http.SessionCreationPolicy;

import com.anindita.jobportal.repository.UserRepository;
import com.anindita.jobportal.security.JwtAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            UserRepository userRepository,
            com.anindita.jobportal.security.JwtUtil jwtUtil)
            throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {})
            .sessionManagement(session -> session
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            .authorizeHttpRequests(auth -> auth

                // =========================
                // PUBLIC
                // =========================
                .requestMatchers(
                        "/auth/login",
                        "/auth/register"
                ).permitAll()

                // Anyone can browse/view jobs
                .requestMatchers(
                        HttpMethod.GET,
                        "/jobs/**"
                ).permitAll()

                // =========================
                // CANDIDATE
                // =========================
                .requestMatchers(
                        "/applications/**",
                        "/candidate/**"
                ).hasRole("CANDIDATE")

                // =========================
                // EMPLOYER
                // =========================
                .requestMatchers(
                        HttpMethod.POST,
                        "/jobs/**"
                ).hasRole("EMPLOYER")

                .requestMatchers(
                        HttpMethod.PUT,
                        "/jobs/**"
                ).hasRole("EMPLOYER")

                .requestMatchers(
                        HttpMethod.DELETE,
                        "/jobs/**"
                ).hasRole("EMPLOYER")

                .requestMatchers(
                        "/recruiter/**"
                ).hasRole("EMPLOYER")

                // =========================
                // ADMIN
                // =========================
                .requestMatchers(
                        "/admin/**"
                ).hasRole("ADMIN")

                // =========================
                // EVERYTHING ELSE
                // =========================
                .anyRequest().authenticated()
            )

            .exceptionHandling(errors -> errors
                    .authenticationEntryPoint((request, response, exception) ->
                            response.sendError(401, "Authentication required"))
                    .accessDeniedHandler((request, response, exception) ->
                            response.sendError(403, "Access denied")))

            .addFilterBefore(
                    new JwtAuthenticationFilter(userRepository, jwtUtil),
                    UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}
