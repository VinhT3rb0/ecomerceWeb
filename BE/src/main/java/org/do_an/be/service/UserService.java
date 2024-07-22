//package org.do_an.be.service;
//
//import lombok.RequiredArgsConstructor;
//import org.do_an.be.dtos.UpdateUserDTO;
//import org.do_an.be.entity.User;
//import org.do_an.be.exception.DataNotFoundException;
//import org.do_an.be.repository.RoleRepository;
//import org.do_an.be.repository.UserRepository;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//@RequiredArgsConstructor
//@Service
//public class UserService {
//    private final UserRepository userRepository;
//    private final RoleRepository roleRepository;
//
//    @Transactional
//    public User updateUser(Integer userId, UpdateUserDTO updatedUserDTO) throws Exception {
//        // Find the existing user by userId
//        User existingUser = userRepository.findById(userId)
//                .orElseThrow(() -> new DataNotFoundException("User not found"));
//
//        // Check if the phone number is being changed and if it already exists for another user
//        /*
//        String newPhoneNumber = updatedUserDTO.getPhoneNumber();
//        if (!existingUser.getPhoneNumber().equals(newPhoneNumber) &&
//                userRepository.existsByPhoneNumber(newPhoneNumber)) {
//            throw new DataIntegrityViolationException("Phone number already exists");
//        }
//       */
//        // Update user information based on the DTO
//        if (updatedUserDTO.getFullName() != null) {
//            existingUser.setFullName(updatedUserDTO.getFullName());
//        }
//        /*
//        if (newPhoneNumber != null) {
//            existingUser.setPhoneNumber(newPhoneNumber);
//        }
//        */
//        if (updatedUserDTO.getAddress() != null) {
//            existingUser.setAddress(updatedUserDTO.getAddress());
//        }
//        if (updatedUserDTO.getDateOfBirth() != null) {
//            existingUser.setDateOfBirth(updatedUserDTO.getDateOfBirth());
//        }
//
//            // Update the password if it is provided in the DTO
//            if (updatedUserDTO.getPassword() != null
//                    && !updatedUserDTO.getPassword().isEmpty()) {
//                if(!updatedUserDTO.getPassword().equals(updatedUserDTO.getRetypePassword())) {
//                    throw new DataNotFoundException("Password and retype password not the same");
//                }
//                String newPassword = updatedUserDTO.getPassword();
//                String encodedPassword = passwordEncoder.encode(newPassword);
//                existingUser.setPassword(encodedPassword);
//            }
//            //existingUser.setRole(updatedRole);
//            // Save the updated user
//            return userRepository.save(existingUser);
//        }
//}
//
//
