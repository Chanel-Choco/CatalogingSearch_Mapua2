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

    /**
     * Defines global CORS configuration for the application.
     *
     * @return WebMvcConfigurer that customizes CORS mappings
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {

        return new WebMvcConfigurer() {

            /**
             * Configures allowed origins, HTTP methods, and headers
             * for cross-origin requests.
             *
             * @param registry CorsRegistry used to define mapping rules
             */
            @Override
            public void addCorsMappings(CorsRegistry registry) {

                registry.addMapping("/**") // Apply to all endpoints
                        .allowedOrigins("http://localhost:4200",
                               "https://cataloging-search-mapua2.vercel.app"
                        ) // Allow Angular frontend
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allow common HTTP methods
                        .allowedHeaders("*") // Allow all headers
                        .allowCredentials(true); // Allow cookies and authentication headers
            }
        };
    }
}