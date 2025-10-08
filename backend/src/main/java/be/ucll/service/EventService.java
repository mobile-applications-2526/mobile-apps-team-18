package be.ucll.service;

import java.util.List;

import org.springframework.stereotype.Service;

import be.ucll.model.Event;
import be.ucll.repository.EventRepository;

@Service
public class EventService {
    
    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public List<Event> getEventsByKotAddress(String kotAddress) {
        if (kotAddress == null || kotAddress.trim().isEmpty()) {
            throw new IllegalArgumentException("KotAddress cannot be null or empty");
        }
        // Repository finder matches Event.kotadress
        return eventRepository.findByKotadressContainingIgnoreCase(kotAddress.trim());
    }

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public String deleteEvent(Long id) {
        eventRepository.deleteById(id);
        return "Event with ID " + id + " deleted successfully";
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id).orElseThrow(() -> new RuntimeException("Event with ID " + id + " not found"));
    }
}
