package be.ucll.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Username should not be empty")
    private String username;

    @NotBlank(message = "Email should not be empty")
    private String email;

    @NotNull(message = "Geboortedatum should not be empty")
    @Past(message = "Geboortedatum must be in the past")
    private LocalDate geboortedatum;

    @NotBlank(message = "Kot locatie may not be empty")
    private String locatie;

    @NotBlank(message = "Password should not be empty")
    private String password;

    @ManyToMany
    @JoinTable(name = "user_dorms", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "dorm_id"))
    private List<Dorm> dorms = new ArrayList<>();

    protected User() {
    }

    public User(String username, String email, LocalDate geboortedatum, String locatie, String password) {
        setUsername(username);
        setEmail(email);
        setGeboortedatum(geboortedatum);
        setLocatie(locatie);
        setPassword(password);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getGeboortedatum() {
        return geboortedatum;
    }

    public void setGeboortedatum(LocalDate geboortedatum) {
        this.geboortedatum = geboortedatum;
    }

    public String getLocatie() {
        return locatie;
    }

    public void setLocatie(String locatie) {
        this.locatie = locatie;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}
