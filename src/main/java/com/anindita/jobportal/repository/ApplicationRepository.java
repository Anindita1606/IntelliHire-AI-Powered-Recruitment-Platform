package com.anindita.jobportal.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.anindita.jobportal.entity.Application;
import com.anindita.jobportal.entity.ApplicationStatus;

public interface ApplicationRepository
        extends JpaRepository<Application, Long> {

    List<Application> findByCandidateIdOrderByAppliedAtDesc(
            Long candidateId
    );

    List<Application> findByJobIdOrderByAppliedAtDesc(
            Long jobId
    );

    Optional<Application> findByJobIdAndCandidateId(
            Long jobId,
            Long candidateId
    );

    long countByJobId(Long jobId);

    long countByJobIdAndStatus(
            Long jobId,
            ApplicationStatus status
    );
}