package com.naren.erpbackend;

import com.naren.erpbackend.security.jwt.JwtProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
@EnableConfigurationProperties(JwtProperties.class)
public class ErpBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(ErpBackendApplication.class, args);
    }

}
