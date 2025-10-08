package be.ucll.model;

import java.time.LocalDate;

import be.ucll.types.TaskType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "tasks")
public class Task {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title should not be empty")
    private String title;

    @NotBlank(message = "Description should not be empty")
    private String description;

    @Column(name = "task_type")
    @NotNull(message = "Type should not be empty")
    private TaskType type;

    @NotNull(message = "Due date should not be null")
    @FutureOrPresent(message = "Due date must be in the present or future")
    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "assigned_user_id")
    private User assignedUser;

    @Column(name = "kot_address")
    @NotNull(message = "KotAddress may not be empty")
    private String kotAddress;

    @ManyToOne
    @JoinColumn(name = "createdBy_id")
    private User createdBy;

    protected Task() {}

    public Task(String title, String description, TaskType type, LocalDate date, User createdBy) {
        setTitle(title);
        setDescription(description);
        setType(type);
        setDate(date);
        setKotAddress(createdBy.getLocatie());
        setCreatedBy(createdBy);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TaskType getType() {
        return type;
    }

    public void setType(TaskType type) {
        this.type = type;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public User getAssignedUser() {
        return assignedUser;
    }

    public void setAssignedUser(User assignedUser) {
        this.assignedUser = assignedUser;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public String getKotAddress() {
        return kotAddress;
    }

    public void setKotAddress(String kotAddress) {
        this.kotAddress = kotAddress;
    }
}
