package com.xenon.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.xenon.jobfind.PhotoRepository;
import com.xenon.model.Photo;

@RestController
@RequestMapping("/api/photos")
@CrossOrigin(origins = "*")
public class PhotoController {

    @Autowired
    private PhotoRepository photoRepository;

    private Cloudinary cloudinary;

    public PhotoController(PhotoRepository photoRepository) {
        this.photoRepository = photoRepository;
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
            "cloud_name", "dqpvxmljh",
            "api_key", "392762242738627", // Replace with your actual API key
            "api_secret", "6f4f6kilWhf8P0U-hgOg4P37b6U" // Replace with your actual API secret
        ));
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadPhoto(@RequestParam("file") MultipartFile file,
                             @RequestParam("title") String title,
                             @RequestParam("userId") String userId) {
        try {
            // Configure upload parameters to use the unsigned preset
            Map<String, String> uploadParams = ObjectUtils.asMap(
                "upload_preset", "post_preset", // Using the preset from your configuration
                "folder", "xenon_jobfinder" // Optional: Organize uploads in a folder
            );

            // Upload to Cloudinary using the preset
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);
            String imageUrl = uploadResult.get("secure_url").toString();

            // Create and save the Photo object
            Photo photo = new Photo(title, imageUrl, userId);
            Photo savedPhoto = photoRepository.save(photo);
            
            return ResponseEntity.ok(savedPhoto);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error uploading image: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public List<Photo> getPhotosByUser(@PathVariable String userId) {
        return photoRepository.findByUserId(userId);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getPhotoById(@PathVariable String id) {
        return photoRepository.findById(id)
                .map(photo -> ResponseEntity.ok(photo))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePhoto(@PathVariable String id) {
        try {
            photoRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting photo: " + e.getMessage());
        }
    }
    
    @GetMapping
    public List<Photo> getAllPhotos() {
        return photoRepository.findAll();
    }
}