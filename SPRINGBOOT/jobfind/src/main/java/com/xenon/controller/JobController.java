package com.xenon.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.xenon.jobfind.JobRepository;
import com.xenon.model.Job;

@RestController
@RequestMapping("/api/jobs")  // Base path for job-related API endpoints
public class JobController {

    private final JobRepository jobRepository;

    @Autowired
    public JobController(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    // ✅ Get all jobs
    @GetMapping
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    // ✅ Get a job by ID
    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable String id) {  
        return jobRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ Get jobs created by a specific recruiter
    @GetMapping("/recruiter/{recruiterId}")
    public List<Job> getJobsByRecruiterId(@PathVariable String recruiterId) {  
        return jobRepository.findByRecruiterId(recruiterId); // FIXED: Uses `recruiterId`
    }

    // ✅ Search jobs by title, description, or company name
    @GetMapping("/search")
    public List<Job> searchJobs(@RequestParam String query) {
        return jobRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrCompanyNameContainingIgnoreCase(
                query, query, query);
    }

    // ✅ Create a new job
    @PostMapping
    public ResponseEntity<Job> createJob(@RequestBody Job job) {
        if (job.getRecruiterId() == null || job.getRecruiterId().isEmpty()) {
            return ResponseEntity.badRequest().body(null); // Ensure recruiterId is present
        }
        
        job.setCreatedAt(LocalDateTime.now());
        job.setUpdatedAt(LocalDateTime.now());
        Job savedJob = jobRepository.save(job);
        return ResponseEntity.ok(savedJob);
    }

    // ✅ Update an existing job
    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(@PathVariable String id, @RequestBody Job jobDetails) {
        return jobRepository.findById(id).map(job -> {
            job.setTitle(jobDetails.getTitle());
            job.setCompanyName(jobDetails.getCompanyName());
            job.setDescription(jobDetails.getDescription());
            job.setLocation(jobDetails.getLocation());
            job.setTechStack(jobDetails.getTechStack());
            job.setUpdatedAt(LocalDateTime.now());
            Job updatedJob = jobRepository.save(job);
            return ResponseEntity.ok(updatedJob);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ Delete a job
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteJob(@PathVariable String id) {
        return jobRepository.findById(id).map(job -> {
            jobRepository.delete(job);
            return ResponseEntity.noContent().build();
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ Applicant applies for a job (Adds applicant to the job's applicants list)
    @PostMapping("/{jobId}/apply")
    public ResponseEntity<Job> applyForJob(@PathVariable String jobId, @RequestParam String applicantId) {
        Optional<Job> optionalJob = jobRepository.findById(jobId);
        if (optionalJob.isPresent()) {
            Job job = optionalJob.get();

            // ✅ FIX: Ensure applicants list is not null before accessing it
            if (job.getApplicants() == null) {
                job.setApplicants(new ArrayList<>());
            }

            if (!job.getApplicants().contains(applicantId)) {
                job.addApplicant(applicantId);
                job.setUpdatedAt(LocalDateTime.now());
                jobRepository.save(job);
            }
            return ResponseEntity.ok(job);
        }
        return ResponseEntity.notFound().build();
    }

    // ✅ Get jobs where a specific applicant has applied
    @GetMapping("/applicant/{applicantId}")
    public List<Job> getJobsByApplicant(@PathVariable String applicantId) {
        return jobRepository.findByApplicantsContaining(applicantId);
    }
}
