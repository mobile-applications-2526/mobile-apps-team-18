package be.ucll.service;

import java.util.List;

import org.springframework.stereotype.Service;

import be.ucll.exception.EventException;
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

    public List<Event> getEventsByDormId(Long dormId) {
        if (dormId == null) {
            throw new EventException("DormId cannot be null or empty");
        }
        return eventRepository.findByDormId(dormId);
    }

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public String deleteEvent(Long id) {
        eventRepository.deleteById(id);
        return "Event with ID " + id + " deleted successfully";
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new EventException("Event with ID " + id + " not found"));
    }
}
