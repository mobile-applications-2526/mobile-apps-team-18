package be.ucll.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import be.ucll.controller.dto.AuthenticationRequest;
import be.ucll.controller.dto.AuthenticationResponse;
import be.ucll.controller.dto.UserInput;
import be.ucll.controller.dto.UserPongDTO;
import be.ucll.model.User;
import be.ucll.service.UserService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/login")
    public AuthenticationResponse login(@RequestBody AuthenticationRequest authenticationRequest) {
        return userService.authenticate(authenticationRequest.username(), authenticationRequest.password());
    }

    @PostMapping("/signup")
    public AuthenticationResponse signup(@Valid @RequestBody UserInput userInput) {
        return userService.signup(userInput);
    }

    @GetMapping("/ping")
    public UserPongDTO ping(Authentication authentication) {
        return userService.ping(authentication);
    }
}
