package be.ucll.service;

import java.util.List;

import org.springframework.stereotype.Service;

import be.ucll.model.Task;
import be.ucll.repository.TaskRepository;
import be.ucll.types.TaskType;

@Service
public class TaskService {
    
    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task createTask(Task task) {
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