package be.ucll.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import be.ucll.controller.dto.TaskDTO;
import be.ucll.exception.TaskException;
import be.ucll.model.Dorm;
import be.ucll.model.Task;
import be.ucll.model.User;
import be.ucll.repository.TaskRepository;
import be.ucll.types.TaskType;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final DormService dormService;
    private final UserService userService;

    public TaskService(TaskRepository taskRepository, DormService dormService, UserService userService) {
        this.taskRepository = taskRepository;
        this.dormService = dormService;
        this.userService = userService;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getTasksByDormId(Long dormId) {
        if (dormId == null) {
            throw new TaskException("DormId cannot be null or empty");
        }
        return taskRepository.findByDormId(dormId);
    }

    public Task createTask(String dormCode, TaskDTO taskDTO, Authentication authentication) {
        User user = userService.findByUsername(authentication.getName());
        Dorm dorm = dormService.getDormByCode(dormCode);
        Task task = new Task(
                taskDTO.title(),
                taskDTO.description(),
                taskDTO.type(),
                taskDTO.date(),
                user
        );

        if (!dorm.getUsers().contains(user)) {
            throw new TaskException("User is not authorized to create tasks for this dorm");
        }

        dorm.addTask(task);
        return taskRepository.save(task);
    }

    public String deleteTask(Long id) {
        taskRepository.deleteById(id);
        return "Task with ID " + id + " has been deleted successfully.";
    }

    public List<Task> getTaskByType(TaskType type) {
        return taskRepository.findByType(type);
    }

}