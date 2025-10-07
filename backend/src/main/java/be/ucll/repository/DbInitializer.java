package be.ucll.repository;

import java.time.LocalDate;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import be.ucll.model.User;
import jakarta.annotation.PostConstruct;

@Component
public class DbInitializer {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public DbInitializer(PasswordEncoder passwordEncoder, UserRepository userRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    public void clearAll() {
        userRepository.deleteAll();
    }

    @PostConstruct
    public void init() {
        clearAll();

        userRepository.save(new User(
                "nathan",
                "nathan@ucll.be",
                LocalDate.of(2005, 2, 1),
                "Leuven", // locatie
                passwordEncoder.encode("nathan123")));

        userRepository.save(new User(
            "Rajo",
            "rajo@ucll.be",
            LocalDate.of(2004, 2, 2),
            "Leuven", // locatie
            passwordEncoder.encode("rajo123")));
    }

}
