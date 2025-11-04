package be.ucll.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import be.ucll.controller.dto.TaskDTO;
import be.ucll.model.Task;
import be.ucll.service.TaskService;
import be.ucll.types.TaskType;
import jakarta.validation.Valid;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public List<Task> getTasks(@RequestParam Long dormId) {
        return taskService.getTasksByDormId(dormId);
    }

    @GetMapping("/all")
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    @PostMapping("/{dormCode}")
    public Task createTask(@PathVariable String dormCode, @Valid @RequestBody TaskDTO taskDTO, Authentication authentication) {
        return taskService.createTask(dormCode, taskDTO, authentication);
    }

    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable Long id) {
        return taskService.deleteTask(id);
    }

    @GetMapping("/type")
    public List<Task> getTaskByType(@RequestParam TaskType type) {
        return taskService.getTaskByType(type);
    }

}
