package com.anindita.jobportal.dto;

import org.springframework.stereotype.Component;

import com.anindita.jobportal.entity.Application;

@Component
public class ApplicationResponseMapper {

    public ApplicationResponse toResponse(
            Application application) {

        ApplicationResponse response =
                new ApplicationResponse();

        response.setId(application.getId());

        if (application.getJob() != null) {

            response.setJob(
                    new ApplicationResponse.JobSummary(
                            application.getJob().getId(),
                            application.getJob().getTitle(),
                            application.getJob().getCompany(),
                            application.getJob().getLocation(),
                            application.getJob().getSalary(),
                            application.getJob().getDescription()
                    )
            );
        }

        if (application.getCandidate() != null) {

            response.setCandidate(
                    new ApplicationResponse.CandidateSummary(
                            application.getCandidate().getId(),
                            application.getCandidate().getFullName(),
                            application.getCandidate().getEmail()
                    )
            );
        }

        response.setPhone(application.getPhone());
        response.setLocation(application.getLocation());
        response.setEducation(application.getEducation());
        response.setExperience(application.getExperience());
        response.setSkills(application.getSkills());
        response.setCoverLetter(application.getCoverLetter());
        response.setResumeFileName(application.getResumeFileName());
        response.setStatus(application.getStatus());
        response.setAppliedAt(application.getAppliedAt());

        return response;
    }
}   