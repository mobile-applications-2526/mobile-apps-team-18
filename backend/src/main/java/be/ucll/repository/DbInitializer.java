package be.ucll.repository;

import java.time.LocalDate;

import org.springframework.cglib.core.Local;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import be.ucll.model.Event;
import be.ucll.model.Task;
import be.ucll.model.User;
import be.ucll.types.TaskType;
import jakarta.annotation.PostConstruct;

@Component
public class DbInitializer {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final TaskRepository taskRepository;

    public DbInitializer(PasswordEncoder passwordEncoder, UserRepository userRepository, EventRepository eventRepository, TaskRepository taskRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.taskRepository = taskRepository;

    }

    public void clearAll() {
        userRepository.deleteAll();
    }

    @PostConstruct
    public void init() {
        clearAll();

        User nathan = new User(
                "nathan",
                "nathan@ucll.be",
                LocalDate.of(2005, 2, 1),
                "Leuven", // locatie
                passwordEncoder.encode("nathan123"));

        User rajo =new User(
            "Rajo",
            "rajo@ucll.be",
            LocalDate.of(2004, 2, 2),
            "Leuven", // locatie
            passwordEncoder.encode("rajo123"));

        User sander = new User(
            "sandercoemans",
            "sander@ucll.be",
            LocalDate.of(2004, 2, 6),   
            "Leuven",
            passwordEncoder.encode("Sander123!"));

        userRepository.save(nathan);
        userRepository.save(rajo);
        userRepository.save(sander);

        Event event1 = new Event(
            "Spring Boot Workshop",
            "Learn the basics of Spring Boot in this hands-on workshop.",
            "Kitchen",
            LocalDate.now().plusDays(10),
            sander
        );

        Event event2 = new Event(
            "Java Conference",
            "Join us for a day of Java talks and networking.",
            "Auditorium",
            LocalDate.now().plusDays(20),
            rajo
        );

        eventRepository.save(event1);
        eventRepository.save(event2);

        Task task1 = new Task("Task 1", "who cares", TaskType.CLEANING, LocalDate.now().plusDays(5), sander);
        Task task2 = new Task("Task 2", "who cares", TaskType.DISHES, LocalDate.now().plusDays(3), rajo);

        task1.setAssignedUser(rajo);
        task2.setAssignedUser(sander);

        taskRepository.save(task1);
        taskRepository.save(task2);
    }

}
