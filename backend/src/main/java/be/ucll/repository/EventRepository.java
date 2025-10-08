package be.ucll.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import be.ucll.model.Event;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
	// Match the exact field name in Event: 'kotadress' (note the spelling)
	List<Event> findByKotadressContainingIgnoreCase(String kotadress);
}
