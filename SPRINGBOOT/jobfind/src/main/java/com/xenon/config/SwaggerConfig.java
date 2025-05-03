package com.xenon.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class SwaggerConfig {
    
    @Bean
    public OpenAPI jobFinderOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Job Finder API")
                        .description("API for managing job posts")
                        .version("1.0"));
    }
}
