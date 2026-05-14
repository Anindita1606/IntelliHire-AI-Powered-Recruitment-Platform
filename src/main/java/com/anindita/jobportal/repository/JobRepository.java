package com.anindita.jobportal.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.anindita.jobportal.entity.Job;

public interface JobRepository
        extends JpaRepository<Job, Long> {
}