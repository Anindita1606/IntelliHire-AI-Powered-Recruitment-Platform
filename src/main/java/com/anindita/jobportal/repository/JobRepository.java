package com.anindita.jobportal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.anindita.jobportal.entity.Job;

public interface JobRepository
        extends JpaRepository<Job, Long> {
    List<Job> findByRecruiterIdOrderByIdDesc(Long recruiterId);
}
