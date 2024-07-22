package org.do_an.be.security;

import lombok.RequiredArgsConstructor;
import org.do_an.be.entity.User;
import org.do_an.be.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;


import java.util.Arrays;
import java.util.Optional;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)


public class SecurityConfig {
    private PasswordEncoder passwordEncoder;

    private UserDetailsService userDetailsService;

    public SecurityConfig(UserDetailsService userDetailsService){
        this.userDetailsService = userDetailsService;
    }
//    @Bean
//    public UserDetailsService userDetailsService() {
//        return subject -> {
//            // Attempt to find user by phone number
//            Optional<User> userByTelephone = userRepository.findByTelephone(subject);
//            if (userByTelephone.isPresent()) {
//                return (UserDetails) userByTelephone.get(); // Return UserDetails if found
//            }
//
//            // If user not found by phone number, attempt to find by email
//            Optional<org.do_an.be.entity.User> userByEmail = userRepository.findByEmail(subject);
//            if (userByEmail.isPresent()) {
//                return userByEmail.get(); // Return UserDetails if found
//            }
//
//            // If user not found by either phone number or email, throw UsernameNotFoundException
//            throw new UsernameNotFoundException("User not found with subject: " + subject);
//        };
//    }
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.cors(AbstractHttpConfigurer::disable);
        //http.csrf(csrf -> csrf.disable());
        http.csrf(AbstractHttpConfigurer::disable);
        http.authorizeHttpRequests((authorize) ->
                        authorize.requestMatchers("/**").permitAll()
                                //.requestMatchers(HttpMethod.POST, "/api/**").permitAll()
                                //.requestMatchers("/api/**").permitAll()
                                //.anyRequest().authenticated()

                );
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {
        return config.getAuthenticationManager();
    }
}
