package com.xenon.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "applications")
public class Application {

    public enum Status {
        APPLIED, REVIEWING, INTERVIEW, REJECTED, OFFERED, ACCEPTED
    }

    @Id
    private String id;
    private String jobId;
    private String recruiterId;  
    private String applicantId;
    private String applicantName;
    private String applicantEmail;
    private String resumeUrl;
    private String coverLetter;
    private Status status = Status.APPLIED;
    private LocalDateTime appliedAt = LocalDateTime.now();

    // Constructor
    public Application(String jobId, String recruiterId, String applicantId, String applicantName, 
                       String applicantEmail, String resumeUrl, String coverLetter) {
        this.jobId = jobId;
        this.recruiterId = recruiterId;
        this.applicantId = applicantId;
        this.applicantName = applicantName;
        this.applicantEmail = applicantEmail;
        this.resumeUrl = resumeUrl;
        this.coverLetter = coverLetter;
    }

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getJobId() { return jobId; }
    public void setJobId(String jobId) { this.jobId = jobId; }

    public String getRecruiterId() { return recruiterId; }
    public void setRecruiterId(String recruiterId) { this.recruiterId = recruiterId; }

    public String getApplicantId() { return applicantId; }
    public void setApplicantId(String applicantId) { this.applicantId = applicantId; }

    public String getApplicantName() { return applicantName; }
    public void setApplicantName(String applicantName) { this.applicantName = applicantName; }

    public String getApplicantEmail() { return applicantEmail; }
    public void setApplicantEmail(String applicantEmail) { this.applicantEmail = applicantEmail; }

    public String getResumeUrl() { return resumeUrl; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }

    public String getCoverLetter() { return coverLetter; }
    public void setCoverLetter(String coverLetter) { this.coverLetter = coverLetter; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }
}
