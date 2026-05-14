package com.anindita.jobportal.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.anindita.jobportal.entity.Role;
import com.anindita.jobportal.repository.RoleRepository;

@Configuration
public class DataInitializer {
	@Bean
	CommandLineRunner initRoles(RoleRepository roleRepo)
	{
		return args -> {
			if(roleRepo.findByName("ADMIN").isEmpty())
			
			{
				roleRepo.save(new Role("ADMIN"));
			}
			  if (roleRepo.findByName("EMPLOYER").isEmpty()) {
	                roleRepo.save(new Role("EMPLOYER"));
	            }

	            if (roleRepo.findByName("CANDIDATE").isEmpty()) { 
	                roleRepo.save(new Role("CANDIDATE"));
	            }
		};
	}
}
