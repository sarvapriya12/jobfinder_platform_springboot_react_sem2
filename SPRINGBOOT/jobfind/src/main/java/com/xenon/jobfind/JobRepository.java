package com.xenon.jobfind;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.xenon.model.Job;

@Repository
public interface JobRepository extends MongoRepository<Job, String> { // ID should be String

    // ✅ FIXED: Changed "findByCreatedBy" to "findByRecruiterId"
    List<Job> findByRecruiterId(String recruiterId);

    // ✅ Search jobs based on title, description, or company name
    List<Job> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrCompanyNameContainingIgnoreCase(
            String title, String description, String companyName);

    // ✅ Find jobs where a specific applicant has applied
    List<Job> findByApplicantsContaining(String applicantId);
}
