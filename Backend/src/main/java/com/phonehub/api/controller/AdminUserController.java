package com.phonehub.api.controller;

import com.phonehub.api.model.User;
import com.phonehub.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return userRepository.findById(id)
                .map(user -> {
                    if (body.containsKey("fullName")) {
                        user.setFullName(body.get("fullName"));
                    }
                    if (body.containsKey("phone")) {
                        user.setPhone(body.get("phone"));
                    }
                    if (body.containsKey("role")) {
                        user.setRole(body.get("role"));
                    }
                    return ResponseEntity.ok(userRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/lock")
    public ResponseEntity<?> toggleLock(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setIsLocked(user.getIsLocked() != null ? !user.getIsLocked() : true);
                    return ResponseEntity.ok(userRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
