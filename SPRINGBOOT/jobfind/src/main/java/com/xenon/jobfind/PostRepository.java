package com.xenon.jobfind;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.xenon.model.Post;

@Repository 
public interface PostRepository extends MongoRepository<Post, String> {
}
