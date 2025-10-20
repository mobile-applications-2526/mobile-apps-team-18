package be.ucll.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import be.ucll.model.Dorm;

public interface DormRepository extends JpaRepository<Dorm, Long> {

}
