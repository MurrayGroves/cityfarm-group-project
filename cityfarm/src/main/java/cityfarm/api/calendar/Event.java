package cityfarm.api.calendar;

import cityfarm.api.animals.*;
import cityfarm.api.enclosure.Enclosure;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.mongodb.lang.NonNull;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.lang.Nullable;

import java.time.ZonedDateTime;
import java.util.List;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(value = EventOnce.class, name = "once"),
        @JsonSubTypes.Type(value = EventRecurring.class, name = "recurring"),
})
@Document("events")
public abstract class Event {
    public List<Enclosure> attachedEnclosures;

    public List<AnimalUnique> attachedAnimals;

    public String title;

    public String description;

    public List<Person> attachedPeople;

    public Boolean all_day;

    public ZonedDateTime start;
    public ZonedDateTime end;

    public abstract List<EventInstance> nextOccurences(@NonNull ZonedDateTime from, @Nullable Integer num);

    public abstract List<EventInstance> occurencesBetween(@NonNull ZonedDateTime from, @NonNull ZonedDateTime to);
}
