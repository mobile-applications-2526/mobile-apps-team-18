package be.ucll.service;

import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import be.ucll.controller.dto.DormCodeDTO;
import be.ucll.controller.dto.DormInputDTO;
import be.ucll.exception.DormException;
import be.ucll.exception.UserException;
import be.ucll.model.Dorm;
import be.ucll.model.User;
import be.ucll.repository.DormRepository;
import be.ucll.repository.UserRepository;

@Service
public class DormService {
    private DormRepository dormRepository;
    private UserRepository userRepository;

    public DormService(DormRepository dormRepository, UserRepository userRepository) {
        this.dormRepository = dormRepository;
        this.userRepository = userRepository;
    }

    public Dorm findDormForUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UserException("Unauthorized");
        }

        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserException("User not found"));

        // Find the dorm that contains this user
        return dormRepository.findByUsers_Id(user.getId())
                .orElseThrow(() -> new DormException("Dorm not found for this user"));
    }

    public Dorm addUserToDormByCode(Authentication authentication, DormCodeDTO dormCodeDTO) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UserException("Unauthorized");
        }

        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserException("User not found"));

        String code = dormCodeDTO.code();

        Dorm dorm = dormRepository.findByCode(code).orElseThrow(() -> new DormException("Dorm not found"));

        if (dorm.getUsers().contains(user)) {
            throw new DormException("You are already registered this dorm");
        }

        dorm.addUser(user);

        userRepository.save(user);
        dormRepository.save(dorm);

        return dorm;
    }

    public Dorm createDorm(Authentication authentication, DormInputDTO dormInputDTO) {
        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new DormException("User not found"));

        String code = UUID.randomUUID().toString().replaceAll("[^A-Za-z]", "").substring(0, 6).toUpperCase();

        Dorm dorm = new Dorm(dormInputDTO.name(), code);
        dorm.setCode(code);
        dorm.addUser(user);

        return dormRepository.save(dorm);
    }

    public Dorm getDormByCode(String dormCode) {
        return dormRepository.findByCode(dormCode)
                .orElseThrow(() -> new DormException("Dorm with code " + dormCode + " not found"));
    }
}
