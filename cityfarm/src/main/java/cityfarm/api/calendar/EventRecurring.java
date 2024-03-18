package cityfarm.api.calendar;


import cityfarm.api.animals.AnimalCustom;
import cityfarm.api.enclosure.Enclosure;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.mongodb.lang.NonNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.lang.Nullable;

import java.time.*;
import java.util.*;

public class EventRecurring extends Event {
    private final ZonedDateTime firstStart;

    private final ZonedDateTime firstEnd;

    private final ZonedDateTime finalEnd;

    private final Duration delay;

    @Override
    public String get_id() {
        return id;
    }

    @Override
    public List<EventInstance> nextOccurences(@Nullable ZonedDateTime from, @Nullable Integer num) {
        List<EventInstance> events = new ArrayList<>();

        from = Objects.requireNonNullElse(from, firstStart);
        ZonedDateTime currentDatetime = firstStart;

        Duration delta = Duration.between(firstStart, firstEnd);

        while (currentDatetime.isBefore(from)) {
            currentDatetime = currentDatetime.plus(delay);
        }

        for (int i = 0; i < Objects.requireNonNullElse(num, 1); i++) {
            EventInstance event = new EventInstance(currentDatetime, currentDatetime.plus(delta), this);
            events.add(event);
            currentDatetime = currentDatetime.plus(delay);
        }

        return events;
    }

    @Override
    public List<EventInstance> occurencesBetween(@Nullable ZonedDateTime from, @Nullable ZonedDateTime to) {
        List<EventInstance> events = new ArrayList<>();

        from = Objects.requireNonNullElse(from, firstStart);
        to = Objects.requireNonNullElse(to, finalEnd);

        ZonedDateTime currentDatetime = firstStart;

        Duration delta = Duration.between(firstStart, firstEnd);

        while (currentDatetime.isBefore(from)) {
            currentDatetime = currentDatetime.plus(delay);
        }

        while (currentDatetime.isBefore(to)) {
            EventInstance event = new EventInstance(currentDatetime, currentDatetime.plus(delta), this);
            events.add(event);
            currentDatetime = currentDatetime.plus(delay);
        }

        return events;
    }

    public EventRecurring(@NonNull ZonedDateTime firstStart,  @NonNull ZonedDateTime firstEnd, @NonNull Duration delay, ZonedDateTime finalEnd, @Nullable String id) {
        this.firstStart = firstStart;
        this.firstEnd = firstEnd;
        this.finalEnd = Objects.requireNonNullElse(finalEnd, ZonedDateTime.parse("2050-08-17T07:12:55.805Z"));
        this.delay = delay;
        this.id = Objects.requireNonNullElseGet(id, () -> UUID.randomUUID().toString());
    }

    @JsonCreator
    @PersistenceCreator
    public EventRecurring(@JsonProperty("firstStart") @NonNull ZonedDateTime firstStart, @JsonProperty("firstEnd") @Nullable ZonedDateTime firstEnd, @JsonProperty("allDay") @NonNull Boolean allDay,
                          @JsonProperty("title") @NonNull String title, @JsonProperty("description") @Nullable String description,
                          @JsonProperty("enclosures") @Nullable List<Enclosure> enclosures, @JsonProperty("animals") @Nullable List<AnimalCustom> animals, @JsonProperty("farms") @Nullable List<String> farms, @JsonProperty("people") @Nullable List<String> attachedPeople,
                          @JsonProperty("finalEnd") @Nullable ZonedDateTime finalEnd, @JsonProperty("delay") @NonNull Duration delay, @JsonProperty("_id") @Nullable String id) {
        if (end == null && !allDay) {
            throw new IllegalArgumentException("If end isn't present, the event must be marked as all day");
        }

        this.firstStart = firstStart;
        this.firstEnd = firstEnd;
        this.finalEnd = Objects.requireNonNullElse(finalEnd, ZonedDateTime.parse("2050-08-17T07:12:55.805Z"));
        this.delay = delay;
        this.id = Objects.requireNonNullElseGet(id, () -> UUID.randomUUID().toString());
        this.allDay = allDay;
        this.title = title;
        this.description = description;
        this.enclosures = enclosures;
        this.animals = animals;
        this.farms = farms;
        this.attachedPeople = attachedPeople;
    }

    @Override
    public String toString() {
        return String.format("Start: %s\nEnd: %s\nFinalEnd: %s\nDelay: %s\nAllDay: %s\nTitle: %s\nDescription: %s\nEnclosures: %s\nAnimals: %s\nFarms: %s\nID: %s\n",
                firstStart, firstEnd, finalEnd, delay, allDay, title, description, enclosures, animals, farms, get_id());
    }
}
