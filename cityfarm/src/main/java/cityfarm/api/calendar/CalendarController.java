package cityfarm.api.calendar;

import cityfarm.api.animals.AnimalCustom;
import cityfarm.api.animals.AnimalRepository;
import cityfarm.api.enclosure.Enclosure;
import cityfarm.api.enclosure.EnclosureRepository;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
public class CalendarController {
    @Autowired
    EventRepository eventRepository;

    @Autowired
    EventRepositoryCustom eventRepositoryCustom;

    @Autowired
    EnclosureRepository enclosureRepository;

    @Autowired
    AnimalRepository animalRepository;

    private final String host_url = "http://localhost:3000";
    HttpHeaders responseHeaders = new HttpHeaders();


    @GetMapping("/api/events")
    public ResponseEntity<List<EventInstance>> get_events(@RequestParam ZonedDateTime from, @RequestParam ZonedDateTime to) {
        responseHeaders.set(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, host_url);

        List<Event> events = eventRepository.findAll();

        List<EventInstance> instances = new ArrayList<>();

        for (Event event : events) {
            instances.addAll(event.occurencesBetween(from, to));
        }

        return ResponseEntity.ok().headers(responseHeaders).body(instances);
    }

    @GetMapping("/api/events/by_id/{id}")
    public ResponseEntity<Event> get_event_by_id(@PathVariable String id) {
        responseHeaders.set(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, host_url);

        Event event = eventRepository.findEventById(id);

        if (event == null) {
            return ResponseEntity.status(404).build();
        }

        return ResponseEntity.ok().body(event);
    }

    @GetMapping("/api/events/by_title/{title}")
    public ResponseEntity<List<Event>> get_events_by_title(@PathVariable String title) {
        responseHeaders.set(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, host_url);

        List<Event> events = eventRepositoryCustom.findEventByTitle(title);

        return ResponseEntity.ok().body(events);
    }

    @GetMapping("/api/events/by_animal/{animal_id}")
    public ResponseEntity<List<Event>> get_events_by_animal(@PathVariable String animal_id) {
        responseHeaders.set(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, host_url);

        List<Event> events = eventRepository.findEventByAnimal(animal_id);

        return ResponseEntity.ok().body(events);
    }

    @GetMapping("/api/events/by_enclosure/{enclosure_id}")
    public ResponseEntity<List<Event>> get_events_by_enclosure(@PathVariable String enclosure_id) {
        responseHeaders.set(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, host_url);

        List<Event> events = eventRepository.findEventByEnclosure(enclosure_id);

        return ResponseEntity.ok().body(events);
    }

    @DeleteMapping("/api/events/by_id/{id}")
    public ResponseEntity<String> delete_event(@PathVariable String id) {
        responseHeaders.set(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, host_url);

        eventRepository.deleteById(id);

        return ResponseEntity.ok(id);
    }


    @PostMapping("/api/events/create/once")
    public ResponseEntity<Event> create_event(@RequestBody CreateEventOnceRequest event) {
        responseHeaders.set(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, host_url);

        List<Enclosure> enclosures = new ArrayList<>();
        for (String enclosure: event.enclosures) {
            Enclosure enc = enclosureRepository.findEnclosureById(enclosure);
            enclosures.add(enc);
        }

        List<AnimalCustom> animals = new ArrayList<>();
        for (String animal: event.animals) {
            AnimalCustom anm = animalRepository.findAnimalById(animal);
            animals.add(anm);
        }

        EventOnce new_event = new EventOnce(event.start, event.end, event.all_day, event.title, event.description, null, enclosures, animals, null);

        eventRepository.save(new_event);

        return ResponseEntity.ok().headers(responseHeaders).body(new_event);
    }

    @PostMapping("/api/events/create/recurring")
    public ResponseEntity<Event> create_event(@RequestBody CreateEventRecurringRequest event) {
        responseHeaders.set(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, host_url);

        List<Enclosure> enclosures = new ArrayList<>();
        for (String enclosure: event.enclosures) {
            Enclosure enc = enclosureRepository.findEnclosureById(enclosure);
            enclosures.add(enc);
        }

        List<AnimalCustom> animals = new ArrayList<>();
        for (String animal: event.animals) {
            AnimalCustom anm = animalRepository.findAnimalById(animal);
            animals.add(anm);
        }

        EventRecurring newEvent = new EventRecurring(event.start, event.firstEnd, event.all_day, event.title, event.description, enclosures, animals, event.people, event.end, event.delay, null);

        eventRepository.save(newEvent);

        return ResponseEntity.ok().headers(responseHeaders).body(newEvent);
    }

}
