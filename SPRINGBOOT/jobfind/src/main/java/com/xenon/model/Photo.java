package com.xenon.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "photos")
public class Photo {

    @Id
    private String id;
    private String title;
    private String imageUrl;
    private String userId; // <-- NEW FIELD (Owner)

    public Photo() {}

    public Photo(String title, String imageUrl, String userId) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.userId = userId;
    }

    // Getters and Setters
    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getImageUrl() { return imageUrl; }
    public String getUserId() { return userId; }

    public void setId(String id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public void setUserId(String userId) { this.userId = userId; }
}
