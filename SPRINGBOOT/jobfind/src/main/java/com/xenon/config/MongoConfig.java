// package com.xenon.config;

// import org.springframework.context.annotation.Configuration;
// import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;

// import com.mongodb.ConnectionString;
// import com.mongodb.MongoClientSettings;
// import com.mongodb.client.MongoClient;
// import com.mongodb.client.MongoClients;

// @Configuration
// public class MongoConfig extends AbstractMongoClientConfiguration {
    
//     @SuppressWarnings("null")
//     @Override
//     protected String getDatabaseName() {
//         return "xenon_jobfinder";
//     }
    
//     @SuppressWarnings("null")
//     @Override
//     public MongoClient mongoClient() {
//         ConnectionString connectionString = new ConnectionString("mongodb://localhost:27017/xenon_jobfinder");
//         MongoClientSettings mongoClientSettings = MongoClientSettings.builder()
//             .applyConnectionString(connectionString)
//             .build();
        
//         return MongoClients.create(mongoClientSettings);
//     }
// }