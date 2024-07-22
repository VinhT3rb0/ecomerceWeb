package org.do_an.be.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.do_an.be.dtos.RefreshTokenDTO;
import org.do_an.be.dtos.UserDTO;
import org.do_an.be.dtos.UserLoginDTO;
import org.do_an.be.entity.Role;
import org.do_an.be.entity.Token;
import org.do_an.be.entity.User;
import org.do_an.be.entity.UserAddress;
import org.do_an.be.exception.InvalidPasswordException;
import org.do_an.be.repository.AddressRepository;
import org.do_an.be.repository.RoleRepository;
import org.do_an.be.repository.UserRepository;

import org.do_an.be.responses.ResponseObject;
import org.do_an.be.utils.MessageKeys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.do_an.be.responses.user.*;
import org.do_an.be.components.LocalizationUtils;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(("/api/auth"))
@RequiredArgsConstructor
public class UserController {


    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    private final LocalizationUtils localizationUtils;
    @PostMapping("/signin")
    public ResponseEntity<ResponseObject> authenticateUser(@RequestBody UserLoginDTO loginDto) {
        Optional<User> optionalUser = Optional.empty();
        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    loginDto.getUsernameOrEmail(), loginDto.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            optionalUser = userRepository.findByUsernameOrEmail(loginDto.getUsernameOrEmail(),loginDto.getUsernameOrEmail());
            System.out.println(optionalUser);
            UserResponse userResponse= UserResponse.fromUser(optionalUser.get());
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .message("Success")
                            .data(userResponse)
                            .status(HttpStatus.OK)
                            .build());
        } catch (AuthenticationServiceException e) {
            // Handle specific authentication service exceptions
            return ResponseEntity.badRequest().body(
                    ResponseObject.builder()
                            .message("Authentication error: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .build());
        } catch (org.springframework.security.core.AuthenticationException e) {
            // Handle generic authentication exceptions
            return ResponseEntity.badRequest().body(
                    ResponseObject.builder()
                            .message("Failed")
                            .status(HttpStatus.UNAUTHORIZED)
                            .build());
        }

    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody UserDTO signUpDto){

        // add check for username exists in a DB
        if(userRepository.existsByUsername(signUpDto.getUsername())){
            return new ResponseEntity<>("Username is already taken!", HttpStatus.BAD_REQUEST);
        }

        // add check for email exists in DB
        if(userRepository.existsByEmail(signUpDto.getEmail())){
            return new ResponseEntity<>("Email is already taken!", HttpStatus.BAD_REQUEST);
        }

        if (!signUpDto.getPassword().equals(signUpDto.getRetypePassword())) {
            //registerResponse.setMessage();
            return ResponseEntity.badRequest().body(ResponseObject.builder()
                    .status(HttpStatus.BAD_REQUEST)
                    .data(null)
                    .message(localizationUtils.getLocalizedMessage(MessageKeys.PASSWORD_NOT_MATCH))
                    .build());
        }
        // create user object
        User user = new User();
        user.setUsername(signUpDto.getUsername());
        user.setEmail(signUpDto.getEmail());
        user.setPassword(passwordEncoder.encode(signUpDto.getPassword()));
        user.setTelephone(signUpDto.getTelephone());
        Role roles = roleRepository.findRoleById(2);
        user.setRoles(Collections.singleton(roles));
        UserAddress userAddress = new UserAddress();
        addressRepository.save(userAddress);
        user.setAddress(userAddress);
        userRepository.save(user);

        return new ResponseEntity<>("User registered successfully", HttpStatus.OK);

    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<ResponseObject> getProfiles(@PathVariable int id){
        Optional<User> user = userRepository.findById(id);
        UserResponse userResponse = UserResponse.fromUser(user.get());
        return ResponseEntity.ok(ResponseObject.builder()
                .message("Success")
                .data(userResponse)
                .status(HttpStatus.OK)
                .build());
    }

}
