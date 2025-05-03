package com.xenon.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "jobs") // Defines this as a MongoDB document
public class Job {
    
    @Id
    private String id;  
    private String title;
    private String companyName;
    private String description;
    private String location;
    private String techStack;
    private String recruiterId;  // Changed from `createdBy` to `recruiterId`
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    // ✅ FIX: Applicants list to store applicant IDs
    private List<String> applicants = new ArrayList<>();

    // === Getters and Setters ===
    public String getId() { return id; }
    public void setId(String id) { this.id = id; this.updatedAt = LocalDateTime.now(); }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; this.updatedAt = LocalDateTime.now(); }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; this.updatedAt = LocalDateTime.now(); }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; this.updatedAt = LocalDateTime.now(); }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; this.updatedAt = LocalDateTime.now(); }

    public String getTechStack() { return techStack; }
    public void setTechStack(String techStack) { this.techStack = techStack; this.updatedAt = LocalDateTime.now(); }

    public String getRecruiterId() { return recruiterId; }
    public void setRecruiterId(String recruiterId) { this.recruiterId = recruiterId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<String> getApplicants() { return applicants; }
    public void setApplicants(List<String> applicants) { this.applicants = applicants; }

    public void addApplicant(String applicantId) {
        if (!this.applicants.contains(applicantId)) {
            this.applicants.add(applicantId);
            this.updatedAt = LocalDateTime.now();
        }
    }
}
