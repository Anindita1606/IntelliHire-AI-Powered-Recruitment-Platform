package com.anindita.jobportal.security;

import java.security.Key;
import java.nio.charset.StandardCharsets;
import java.util.Date;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    private final Key key;

    public JwtUtil(@Value("${intellihire.jwt.secret:}") String configuredSecret) {
        if (configuredSecret == null || configuredSecret.isBlank()) {
            // A process-local key keeps a fresh development install runnable.
            // Configure INTELLIHIRE_JWT_SECRET for stable sessions/deployment.
            this.key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
            return;
        }

        byte[] secretBytes = configuredSecret.getBytes(StandardCharsets.UTF_8);
        if (secretBytes.length < 32) {
            throw new IllegalArgumentException(
                    "INTELLIHIRE_JWT_SECRET must contain at least 32 UTF-8 bytes.");
        }
        this.key = Keys.hmacShaKeyFor(secretBytes);
    }

    public String generateToken(String email) {

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(
	            new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24)
	    )
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractSubject(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }
}
