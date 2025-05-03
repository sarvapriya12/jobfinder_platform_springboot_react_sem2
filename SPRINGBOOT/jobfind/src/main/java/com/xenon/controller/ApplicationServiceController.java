package com.xenon.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.xenon.jobfind.ApplicationRepository;
import com.xenon.model.Application;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:3000")
public class ApplicationServiceController {

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";

    @Autowired
    private ApplicationRepository applicationRepository;

    // Upload Job Application
    @PostMapping("/upload")
    public ResponseEntity<Application> uploadApplication(
            @RequestParam("jobId") String jobId,
            @RequestParam(value = "recruiterId", required = false) String recruiterId,
            @RequestParam("applicantId") String applicantId,
            @RequestParam("applicantName") String applicantName,
            @RequestParam("applicantEmail") String applicantEmail,
            @RequestParam("resume") MultipartFile file,

            @RequestParam("coverLetter") String coverLetter) {
    
        if (recruiterId == null || recruiterId.isEmpty()) {
            return ResponseEntity.status(400).body(null);
        }
    
        try {
            Files.createDirectories(Paths.get(UPLOAD_DIR));
    
            String fileName = file.getOriginalFilename();
            Path targetLocation = Paths.get(UPLOAD_DIR, fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
    
            Application application = new Application(jobId, recruiterId, applicantId, applicantName, 
                                                      applicantEmail, fileName, coverLetter);
            return ResponseEntity.ok(applicationRepository.save(application));
    
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }
    
    // Get applications for recruiter
    @GetMapping("/recruiter/{recruiterId}")
    public ResponseEntity<List<Application>> getApplicationsForRecruiter(@PathVariable String recruiterId) {
        return ResponseEntity.ok(applicationRepository.findByRecruiterId(recruiterId));
    }

    // // Serve uploaded resumes (View API) - Inline display
    // @GetMapping("/view/{fileName:.+}")
    // public ResponseEntity<Resource> viewResume(@PathVariable String fileName) {
    //     try {
    //         Path filePath = Paths.get(UPLOAD_DIR).resolve(fileName).normalize();
    //         Resource resource = new UrlResource(filePath.toUri());

    //         if (resource.exists() && resource.isReadable()) {
    //             String contentType = "application/pdf";
    //             if (fileName.toLowerCase().endsWith(".doc")) {
    //                 contentType = "application/msword";
    //             } else if (fileName.toLowerCase().endsWith(".docx")) {
    //                 contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    //             }

    //             return ResponseEntity.ok()
    //                 .contentType(MediaType.parseMediaType(contentType))
    //                 .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
    //                 .body(resource);
    //         } else {
    //             return ResponseEntity.status(404).body(null);
    //         }
    //     } catch (IOException e) {
    //         return ResponseEntity.status(500).body(null);
    //     }
    // }





    // Serve files dynamically
    @GetMapping("/view/{fileName:.+}")
    public ResponseEntity<Resource> viewFile(@PathVariable String fileName) {
        try {
            Path filePath = Paths.get(UPLOAD_DIR).resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.status(404).body(null);
            }

            // Detect file type dynamically
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream"; // Default for unknown files
            }

            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);

        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    // Serve uploaded resumes (Download API)
    @GetMapping("/resume/{fileName:.+}")
    public ResponseEntity<Resource> getResume(@PathVariable String fileName) {
        try {
            Path filePath = Paths.get(UPLOAD_DIR).resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
            } else {
                return ResponseEntity.status(404).body(null);
            }
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}