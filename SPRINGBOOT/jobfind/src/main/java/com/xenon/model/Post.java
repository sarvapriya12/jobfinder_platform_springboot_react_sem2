package com.xenon.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "cluster_xenon")
public class Post {

    @Id
    private String id;

    private String profile;

    @Field("desc")
    private String description;

    private int exp;

    @Field("techs")
    private String[] techstack;

    // Default constructor
    public Post() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getProfile() { return profile; }
    public void setProfile(String profile) { this.profile = profile; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    // Added proper implementation for setDesc to handle MongoDB field naming
    public void setDesc(String description) {
        this.description = description;
    }

    public int getExp() { return exp; }
    public void setExp(int exp) { this.exp = exp; }

    public String[] getTechstack() { return techstack; }
    public void setTechstack(String[] techstack) { this.techstack = techstack; }

    // toString() method
    @Override
    public String toString() {
        if (techstack == null) {
            return "Post{" +
                "id='" + id + '\'' +
                ", profile='" + profile + '\'' +
                ", description='" + description + '\'' +
                ", exp=" + exp +
                ", techstack=null" +
                '}';
        }
        return "Post{" +
                "id='" + id + '\'' +
                ", profile='" + profile + '\'' +
                ", description='" + description + '\'' +
                ", exp=" + exp +
                ", techstack=[" + String.join(", ", techstack) + "]" +
                '}';
    }
}