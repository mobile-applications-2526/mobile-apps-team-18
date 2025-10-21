package be.ucll.repository;

import java.time.LocalDate;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import be.ucll.model.Dorm;
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
        private final DormRepository dormRepository;

        public DbInitializer(
                        PasswordEncoder passwordEncoder,
                        UserRepository userRepository,
                        EventRepository eventRepository,
                        TaskRepository taskRepository,
                        DormRepository dormRepository) {
                this.passwordEncoder = passwordEncoder;
                this.userRepository = userRepository;
                this.eventRepository = eventRepository;
                this.taskRepository = taskRepository;
                this.dormRepository = dormRepository;
        }

        public void clearAll() {
                dormRepository.deleteAll();
                taskRepository.deleteAll();
                eventRepository.deleteAll();
                userRepository.deleteAll();
        }

        @PostConstruct
        public void init() {
                clearAll();

                // --- USERS ---
                User nathan = new User("nathan", "nathan@ucll.be", LocalDate.of(2005, 2, 1), "Leuven",
                                passwordEncoder.encode("nathan123"));
                User rajo = new User("rajo", "rajo@ucll.be", LocalDate.of(2004, 2, 2), "Leuven",
                                passwordEncoder.encode("rajo123"));
                User sander = new User("sander", "sander@ucll.be", LocalDate.of(2004, 2, 6), "Leuven",
                                passwordEncoder.encode("sander123"));

                userRepository.save(nathan);
                userRepository.save(rajo);
                userRepository.save(sander);

                // --- DORMS ---
                Dorm blijdeInkom = new Dorm("Blijde-Inkomstraat", "AAA");
                Dorm tiensestraat = new Dorm("Tiensestraat", "BBB");

                // Add users to dorms
                blijdeInkom.addUser(nathan);
                blijdeInkom.addUser(rajo);

                // --- TASKS ---
                Task task1 = new Task("Vacuum the living room", "Use the Dyson in the closet", TaskType.CLEANING,
                                LocalDate.now().plusDays(1), nathan);
                Task task2 = new Task("Wash the dishes", "Don't forget to use the eco cycle", TaskType.DISHES,
                                LocalDate.now().plusDays(2), rajo);
                Task task3 = new Task("Take out the trash", "Bins are outside near the gate", TaskType.CLEANING,
                                LocalDate.now().plusDays(3), sander);
                Task task4 = new Task("Buy paper towels", "Get a pack from Carrefour", TaskType.GROCERIES,
                                LocalDate.now().plusDays(5), nathan);
                Task task5 = new Task("Clean the kitchen", "Deep clean scheduled before inspection", TaskType.CLEANING,
                                LocalDate.now().plusDays(6), rajo);

                // Set assigned users
                task1.setAssignedUser(nathan);
                task2.setAssignedUser(rajo);
                task3.setAssignedUser(sander);
                task4.setAssignedUser(nathan);
                task5.setAssignedUser(rajo);

                // Add tasks to dorms (sets dorm in task)
                blijdeInkom.addTask(task1);
                blijdeInkom.addTask(task2);
                blijdeInkom.addTask(task4);

                tiensestraat.addTask(task3);
                tiensestraat.addTask(task5);

                // --- EVENTS ---
                Event event1 = new Event("Spring Boot Workshop",
                                "Learn how to build powerful web apps with Spring Boot.", "Common Room",
                                LocalDate.now().plusDays(5), nathan);
                Event event2 = new Event("Pizza & Movie Night", "Relax evening watching movies and eating pizza.",
                                "Living Room", LocalDate.now().plusDays(10), rajo);
                Event event3 = new Event("Dorm Cleaning Day", "Everyone helps clean the shared spaces together.",
                                "Hallway", LocalDate.now().plusDays(3), sander);

                // Add events to dorms (sets dorm in event)
                blijdeInkom.addEvent(event1);
                blijdeInkom.addEvent(event2);
                tiensestraat.addEvent(event3);

                // --- SAVE DORMS (cascade will save tasks/events) ---
                dormRepository.save(blijdeInkom);
                dormRepository.save(tiensestraat);

                eventRepository.save(event1);
                eventRepository.save(event2);
                eventRepository.save(event3);

                taskRepository.save(task1);
                taskRepository.save(task2);
                taskRepository.save(task3);
                taskRepository.save(task4);
                taskRepository.save(task5);

                // Save users (optional, already saved)
                userRepository.save(nathan);
                userRepository.save(rajo);
                userRepository.save(sander);

        }
}
