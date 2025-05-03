package com.xenon.jobfind;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.xenon", "com.xenon.config"}) // Ensure scanning the right package
public class JobfindApplication {
    public static void main(String[] args) {
        SpringApplication.run(JobfindApplication.class, args);
    }
}
