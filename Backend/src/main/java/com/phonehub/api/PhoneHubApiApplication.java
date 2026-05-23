package com.phonehub.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class PhoneHubApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(PhoneHubApiApplication.class, args);
	}
}
