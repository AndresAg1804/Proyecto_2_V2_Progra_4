package com.example.proyecto_2_v2;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;

import java.sql.SQLOutput;

@SpringBootApplication
public class Proyecto2V2Application {

	public static void main(String[] args) {

		SpringApplication.run(Proyecto2V2Application.class, args);

	}

	@Bean("securityFilterChain")
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		var chain = http
				.authorizeHttpRequests(customizer -> customizer
						.anyRequest().permitAll()
				)
				.exceptionHandling(customizer -> customizer
						.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
				)
				.csrf().disable()
				.build();
		return chain;
//		var chain = http
//				.authorizeHttpRequests(customizer -> customizer
//						.requestMatchers("/api/login/login").permitAll()
//						.requestMatchers("/api/login/logout").authenticated()
//						.requestMatchers(HttpMethod.POST,"/api/**").hasAnyAuthority("ADM","PRO")
//						.requestMatchers("/api/**").hasAnyAuthority("ADM","PRO")//cuando no hay nada de verbo son todos
//						.requestMatchers("/**").permitAll()
//				)
//				.exceptionHandling(customizer -> customizer
//						.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
//				.csrf().disable()
//				.build();
//		return chain;
	}

}


