package com.catalog.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS Configuration Class
 *
 * This configuration enables Cross-Origin Resource Sharing (CORS)
 * to allow the Angular frontend (running on localhost:4200)
 * to communicate with the Spring Boot backend.
 */
@Configuration
public class CorsConfig {

}