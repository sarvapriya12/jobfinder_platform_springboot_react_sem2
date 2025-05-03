package com.xenon.jobfind;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.xenon.model.Application;

public interface ApplicationRepository extends MongoRepository<Application, String> {
    List<Application> findByRecruiterId(String recruiterId);
    List<Application> findByJobId(String jobId);
    List<Application> findByApplicantId(String applicantId);
}
