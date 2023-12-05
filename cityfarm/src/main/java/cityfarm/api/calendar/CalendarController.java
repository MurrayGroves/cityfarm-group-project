package cityfarm.api.calendar;

import cityfarm.api.animals.AnimalGeneric;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
public class CalendarController {
    @Autowired
    EventsRepository eventsRepository;

    @GetMapping("/api/events")
    public List<EventInstance> get_events(@RequestParam ZonedDateTime from, @RequestParam ZonedDateTime to) {
        List<Event> events = eventsRepository.findAll();

        List<EventInstance> instances = new ArrayList<>();

        for (Event event : events) {
            instances.addAll(event.occurencesBetween(from, to));
        }

        return instances;
    }

    @PostMapping("/api/events/create")
    public ResponseEntity<Event> create_event(Event event) {
        eventsRepository.save(event);

        return ResponseEntity.ok().body(event);
    }

}
