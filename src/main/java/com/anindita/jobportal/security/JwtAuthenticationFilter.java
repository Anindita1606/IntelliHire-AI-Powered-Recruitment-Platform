package com.anindita.jobportal.security;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.anindita.jobportal.entity.Role;
import com.anindita.jobportal.entity.User;
import com.anindita.jobportal.repository.UserRepository;

import io.jsonwebtoken.JwtException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(
            UserRepository userRepository,
            JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader =
                request.getHeader("Authorization");

        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {

            String email = jwtUtil.extractSubject(token);

            if (email != null &&
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication() == null) {

                User user = userRepository
                        .findByEmail(email)
                        .orElse(null);

                if (user != null) {

                    List<SimpleGrantedAuthority> authorities =
                            user.getRoles()
                                    .stream()
                                    .map(Role::getName)
                                    .map(role ->
                                            new SimpleGrantedAuthority(
                                                    "ROLE_" + role
                                            )
                                    )
                                    .toList();

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    email,
                                    null,
                                    authorities
                            );

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(authentication);
                }
            }

        } catch (JwtException | IllegalArgumentException e) {
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}
