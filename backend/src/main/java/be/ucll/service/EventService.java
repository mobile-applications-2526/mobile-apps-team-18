package be.ucll.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import be.ucll.controller.dto.EventDTO;
import be.ucll.exception.EventException;
import be.ucll.model.Dorm;
import be.ucll.model.Event;
import be.ucll.model.User;
import be.ucll.repository.EventRepository;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final DormService dormService;
    private final UserService userService;

    public EventService(EventRepository eventRepository, DormService dormService, UserService userService) {
        this.eventRepository = eventRepository;
        this.dormService = dormService;
        this.userService = userService;
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

    public Event createEvent(String dormCode, EventDTO eventInput, Authentication authentication) {
        User user = userService.findByUsername(authentication.getName());
        Dorm dorm = dormService.getDormByCode(dormCode);
        Event event = new Event(
                eventInput.name(),
                eventInput.description(),
                eventInput.location(),
                eventInput.date(), 
                user
                );

        if (!dorm.getUsers().contains(user)) {
            throw new EventException("User is not authorized to create events for this dorm");
        }

        dorm.addEvent(event);
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
