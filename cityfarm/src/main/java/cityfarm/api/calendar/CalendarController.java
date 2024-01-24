package cityfarm.api.calendar;

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

    @DeleteMapping("/api/events/by_id/{id}")
    public ResponseEntity<String> delete_event(@PathVariable String id) {
        responseHeaders.set(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, host_url);

        eventRepository.deleteById(id);

        return ResponseEntity.ok(id);
    }


    @PostMapping("/api/events/create/once")
    public ResponseEntity<Event> create_event(@RequestBody EventOnce event) {
        responseHeaders.set(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, host_url);

        eventRepository.save(event);

        return ResponseEntity.ok().headers(responseHeaders).body(event);
    }

    @PostMapping("/api/events/create/recurring")
    public ResponseEntity<Event> create_event(@RequestBody EventRecurring event) {
        responseHeaders.set(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, host_url);

        eventRepository.save(event);

        return ResponseEntity.ok().headers(responseHeaders).body(event);
    }

}
