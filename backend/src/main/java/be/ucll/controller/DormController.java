package be.ucll.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import be.ucll.controller.dto.DormCodeDTO;
import be.ucll.controller.dto.DormInputDTO;
import be.ucll.model.Dorm;
import be.ucll.service.DormService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/dorms")
public class DormController {
    private final DormService dormService;

    public DormController(DormService dormService) {
        this.dormService = dormService;
    }

    @GetMapping()
    public Dorm getAllDorms(Authentication authentication) {
        return dormService.findDormForUser(authentication);
    }

    @PutMapping()
    public Dorm addUserToDormByCode(Authentication authentication, @RequestBody DormCodeDTO dormCodeInput) {
        return dormService.addUserToDormByCode(authentication, dormCodeInput);
    }

    @PostMapping()
    public Dorm createDorm(Authentication authentication, @RequestBody DormInputDTO dormInputDTO) {
        return dormService.createDorm(authentication, dormInputDTO);
    }

}
