package cityfarm.api.calendar;

import cityfarm.api.animals.AnimalCustom;
import cityfarm.api.animals.AnimalRepository;
import cityfarm.api.enclosure.Enclosure;
import cityfarm.api.enclosure.EnclosureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://cityfarm.murraygrov.es"}, methods = {RequestMethod.GET, RequestMethod.POST})
public class CalendarController {
    @Autowired
    EventRepository eventRepository;

    @Autowired
    EventRepositoryCustom eventRepositoryCustom;

    @Autowired
    EnclosureRepository enclosureRepository;

    @Autowired
    AnimalRepository animalRepository;

    @GetMapping("/api/events")
    public ResponseEntity<List<EventInstance>> get_events(
            @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) ZonedDateTime from
            , @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) ZonedDateTime to) {


        List<Event> events = eventRepositoryCustom.findBetween(from, to);

        List<EventInstance> instances = new ArrayList<>();

        for (Event event : events) {
            instances.addAll(event.occurencesBetween(from, to));
        }

        return ResponseEntity.ok().body(instances);
    }

    @GetMapping("/api/events/non_instanced")
    public ResponseEntity<List<Event>> get_events_non_instanced() {
        List<Event> events = eventRepository.findAll();

        return ResponseEntity.ok().body(events);
    }

    @GetMapping("/api/events/by_id/{id}")
    public ResponseEntity<Event> get_event_by_id(@PathVariable String id) {


        Event event = eventRepository.findEventById(id);

        if (event == null) {
            return ResponseEntity.status(404).build();
        }

        return ResponseEntity.ok().body(event);
    }

    @GetMapping("/api/events/by_title/{title}")
    public ResponseEntity<List<Event>> get_events_by_title(@PathVariable String title) {


        List<Event> events = eventRepositoryCustom.findEventByTitle(title);

        return ResponseEntity.ok().body(events);
    }

    @GetMapping("/api/events/by_animal/{animal_id}")
    public ResponseEntity<List<Event>> get_events_by_animal(@PathVariable String animal_id) {
        List<Event> events = eventRepository.findEventByAnimal(animal_id);

        return ResponseEntity.ok().body(events);
    }

    @GetMapping("/api/events/by_enclosure/{enclosure_id}")
    public ResponseEntity<List<Event>> get_events_by_enclosure(@PathVariable String enclosure_id) {


        List<Event> events = eventRepository.findEventByEnclosure(enclosure_id);

        return ResponseEntity.ok().body(events);
    }

    @DeleteMapping("/api/events/by_id/{id}")
    public ResponseEntity<String> delete_event(@PathVariable String id) {


        eventRepository.deleteById(id);

        return ResponseEntity.ok(id);
    }


    @PostMapping("/api/events/create/once")
    public ResponseEntity<Event> create_event(@RequestBody CreateEventOnceRequest event) {
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

        EventOnce new_event = new EventOnce(event.start, event.end, event.allDay, event.title, event.description, null, enclosures, event.enclosures, animals, event.animals, event.farms, null);

        System.out.println(new_event);
        try {
            eventRepository.save(new_event);
        } catch (Exception e) {
            e.printStackTrace();
            System.exit(0);
        }

        return ResponseEntity.ok().body(new_event);
    }

    @PostMapping("/api/events/create/recurring")
    public ResponseEntity<Event> create_event(@RequestBody CreateEventRecurringRequest event) {
        if (event.delay.isZero()) {
            return ResponseEntity.status(400).build();
        }

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

        EventRecurring newEvent = new EventRecurring(event.firstStart, event.firstEnd, event.allDay, event.title, event.description, enclosures, event.enclosures, animals, event.animals, event.farms, event.people, event.end, event.delay, null);

        eventRepository.save(newEvent);

        return ResponseEntity.ok().body(newEvent);
    }

    @PatchMapping("/api/events/once/by_id/{id}/update")
    public ResponseEntity<String> update_once_event(@PathVariable String id, @RequestBody CreateEventOnceRequest eventReq) {
        Event event = eventRepository.findEventById(id);

        if (event == null) {
            return ResponseEntity.status(404).build();
        }

        List<Enclosure> enclosures = new ArrayList<>();
        for (String enclosure: eventReq.enclosures) {
            Enclosure enc = enclosureRepository.findEnclosureById(enclosure);
            enclosures.add(enc);
        }

        List<AnimalCustom> animals = new ArrayList<>();
        for (String animal: eventReq.animals) {
            AnimalCustom anm = animalRepository.findAnimalById(animal);
            animals.add(anm);
        }

        event.allDay = eventReq.allDay;
        event.title = eventReq.title;
        event.description = eventReq.description;
        event.enclosureRefs = enclosures;
        event.animalRefs = animals;
        event.farms = eventReq.farms;

        if (event instanceof EventOnce) {
            EventOnce eventOnce = (EventOnce) event;
            eventOnce.start = eventReq.start;
            eventOnce.end = eventReq.end;
        } else if (event instanceof EventRecurring) {
            return ResponseEntity.badRequest().body("Cannot update a recurring event with a once event request");
        }

        eventRepository.save(event);

        String location = String.format("/api/events/by_id/%s", event.get_id());
        return ResponseEntity.created(URI.create(location)).body(event.get_id());
    }

    @PatchMapping("/api/events/recurring/by_id/{id}/update")
    public ResponseEntity<String> update_recurring_event(@PathVariable String id, @RequestBody CreateEventRecurringRequest eventReq) {
        Event event = eventRepository.findEventById(id);

        if (event == null) {
            return ResponseEntity.status(404).build();
        }

        List<Enclosure> enclosures = new ArrayList<>();
        for (String enclosure: eventReq.enclosures) {
            Enclosure enc = enclosureRepository.findEnclosureById(enclosure);
            enclosures.add(enc);
        }

        List<AnimalCustom> animals = new ArrayList<>();
        for (String animal: eventReq.animals) {
            AnimalCustom anm = animalRepository.findAnimalById(animal);
            animals.add(anm);
        }

        event.allDay = eventReq.allDay;
        event.title = eventReq.title;
        event.description = eventReq.description;
        event.enclosureRefs = enclosures;
        event.animalRefs = animals;
        event.farms = eventReq.farms;

        if (event instanceof EventRecurring) {
            EventRecurring eventRecurring = (EventRecurring) event;
            eventRecurring.firstStart = eventReq.firstStart;
            eventRecurring.firstEnd = eventReq.firstEnd;
            eventRecurring.finalEnd = eventReq.end;
        } else if (event instanceof EventOnce) {
            return ResponseEntity.badRequest().body("Cannot update a once event with a recurrin event request");
        }

        eventRepository.save(event);

        String location = String.format("/api/events/by_id/%s", event.get_id());
        return ResponseEntity.created(URI.create(location)).body(event.get_id());
    }

}
