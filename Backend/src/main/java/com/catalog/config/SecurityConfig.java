package com.catalog.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Security Configuration Class
 *
 * This class configures basic Spring Security behavior
 * for the application.
 *
 * Currently:
 * - CSRF protection is disabled
 * - All HTTP requests are permitted
 *
 * This setup is suitable for development and testing
 * environments where authentication is handled manually
 * or through custom role validation logic.
 */
@Configuration
public class SecurityConfig {

    /**
     * Defines the security filter chain configuration.
     *
     * @param http HttpSecurity object used to configure
     *             web-based security for specific HTTP requests
     * @return configured SecurityFilterChain
     * @throws Exception if a security configuration error occurs
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                // Disables Cross-Site Request Forgery protection.
                // Commonly disabled for REST APIs during development.
                .cors(cors -> cors.configure(http))
                .csrf(csrf -> csrf.disable())

                // Configures authorization rules for HTTP requests.
                .authorizeHttpRequests(auth -> auth

                        // Allows all incoming requests without authentication.
                        // Role-based access is currently handled manually
                        // inside service-layer logic.
                        .anyRequest().permitAll()
                );

        return http.build();
    }
}