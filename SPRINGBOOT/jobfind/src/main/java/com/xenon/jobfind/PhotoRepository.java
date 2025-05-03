package com.xenon.jobfind;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.xenon.model.Photo;

@Repository
public interface PhotoRepository extends MongoRepository<Photo, String> {
    List<Photo> findByUserId(String userId);
}