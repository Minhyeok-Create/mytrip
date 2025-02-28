package com.lec.spring.mytrip.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class MvcConfig implements WebMvcConfigurer {
    @Value("${app.upload.path}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        //  /upload/** URL 로 request 가 들어오면
        // upload/ 경로의 resource 가 동작케 함.
        // IntelliJ 의 경우 이 경로를 module 이 아닌 project 이하에 생성해야 한다.
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + System.getProperty("user.dir") + File.separator + "uploads" + File.separator);
    }
}