package cityfarm.api.calendar;

import cityfarm.api.animals.AnimalGeneric;
import cityfarm.api.db.ZonedDateTimeReadConverter;
import cityfarm.api.db.ZonedDateTimeWriteConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Arrays;
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

    @PostMapping("/api/events/create/once")
    public ResponseEntity<Event> create_event(@RequestBody EventOnce event) {
        eventsRepository.save(event);

        return ResponseEntity.ok().body(event);
    }

}
