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
    public ZonedDateTime firstStart;

    public ZonedDateTime firstEnd;

    // The datetime at which the last occurence of the event will end
    public ZonedDateTime finalEnd;

    // The delay between each occurence of the event, Period supports Years, Months, & Days
    public Period delay;

    @Override
    public String get_id() {
        return id;
    }

    @Override
    public List<EventInstance> nextOccurences(@Nullable ZonedDateTime from, @Nullable Integer num) {
        List<EventInstance> events = new ArrayList<>();

        // If no `from` is provided, we start from the first occurence
        from = Objects.requireNonNullElse(from, firstStart);

        // Initialise our cursor to the first occurence
        ZonedDateTime currentDatetime = firstStart;

        // Calculate how long each event occurence lasts
        Duration delta = Duration.between(firstStart, firstEnd);

        // If `from` is after the first occurence, set the cursor to the first occurence after `from`
        if (firstStart.isBefore(from)) {
            int days = delay.getDays() + delay.getMonths() * 28 + delay.getYears() * 365;
            Duration difference = Duration.between(firstStart, from);

            // Calculate how many steps we need to take to get near the `from` datetime
            int steps = ((int) difference.toDays()) / days + 1;

            currentDatetime = firstStart.plus(delay.multipliedBy(steps));
        }


        // Calculate `num` new occurences, or 1 if `num` is not provided
        for (int i = 0; i < Objects.requireNonNullElse(num, 1); i++) {
            // Create a new Instance starting at the current cursor position and ending `delta` time later
            EventInstance event = new EventInstance(currentDatetime, currentDatetime.plus(delta), this);
            events.add(event);
            // Move the cursor to the next occurence
            currentDatetime = currentDatetime.plus(delay);
        }

        return events;
    }

    @Override
    public List<EventInstance> occurencesBetween(@Nullable ZonedDateTime from, @Nullable ZonedDateTime to) {
        List<EventInstance> events = new ArrayList<>();

        // If no `from` is provided, we start from the first occurence
        from = Objects.requireNonNullElse(from, firstStart);
        // If no `to` is provided, we end at the final occurence
        to = Objects.requireNonNullElse(to, finalEnd);

        // Initialise our cursor to the first occurence
        ZonedDateTime currentDatetime = firstStart;

        // Calculate how long each event occurence lasts
        Duration delta = Duration.between(firstStart, firstEnd);

        // If `from` is after the first occurence, set the cursor to the first occurence after `from`
        if (firstStart.isBefore(from)) {
            int days = delay.getDays() + delay.getMonths() * 28 + delay.getYears() * 365;
            Duration difference = Duration.between(firstStart, from);

            // Calculate how many steps we need to take to get near the `from` datetime            
            int steps = ((int) difference.toDays()) / days + 1;

            currentDatetime = firstStart.plus(delay.multipliedBy(steps));
        }

        // Create occurences until we reach the `to` datetime
        while (currentDatetime.isBefore(to)) {
            // Create a new Instance starting at the current cursor position and ending `delta` time later
            EventInstance event = new EventInstance(currentDatetime, currentDatetime.plus(delta), this);
            events.add(event);
            // Move the cursor to the next occurence
            currentDatetime = currentDatetime.plus(delay);
        }

        return events;
    }

    public EventRecurring(@NonNull ZonedDateTime firstStart,  @NonNull ZonedDateTime firstEnd, @NonNull Period delay, ZonedDateTime finalEnd, @Nullable String id) {
        this.firstStart = firstStart;
        this.firstEnd = firstEnd;
        this.finalEnd = Objects.requireNonNullElse(finalEnd, ZonedDateTime.parse("2999-12-31T23:59:59.999Z"));
        this.delay = delay;
        this.id = Objects.requireNonNullElseGet(id, () -> UUID.randomUUID().toString());
    }

    @JsonCreator
    @PersistenceCreator
    public EventRecurring(@JsonProperty("firstStart") @NonNull ZonedDateTime firstStart, @JsonProperty("firstEnd") @Nullable ZonedDateTime firstEnd, @JsonProperty("allDay") @NonNull Boolean allDay,
                          @JsonProperty("title") @NonNull String title, @JsonProperty("description") @Nullable String description,
                          @JsonProperty("enclosures") @Nullable List<Enclosure> enclosures, @JsonProperty("animals") @Nullable List<AnimalCustom> animals, @JsonProperty("farms") @Nullable List<String> farms, @JsonProperty("people") @Nullable List<String> attachedPeople,
                          @JsonProperty("finalEnd") @Nullable ZonedDateTime finalEnd, @JsonProperty("delay") @NonNull Period delay, @JsonProperty("_id") @Nullable String id) {
        if (firstEnd == null && !allDay) {
            throw new IllegalArgumentException("If end isn't present, the event must be marked as all day");
        }

        this.firstStart = firstStart;
        this.firstEnd = firstEnd;
        this.finalEnd = Objects.requireNonNullElse(finalEnd, ZonedDateTime.parse("2999-12-31T23:59:59.999Z"));
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
