package cityfarm.api.calendar;

import cityfarm.api.animals.AnimalCustom;
import cityfarm.api.enclosure.Enclosure;
import cityfarm.api.schemas.AnimalSchema;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.mongodb.lang.NonNull;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.lang.Nullable;
import org.springframework.data.mongodb.core.mapping.*;

import java.time.ZonedDateTime;
import java.util.List;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(value = EventOnce.class, name = "once"),
        @JsonSubTypes.Type(value = EventRecurring.class, name = "recurring"),
})
@Document("events")
public abstract class Event {
    // List of IDs of attached enclosures
    @DocumentReference(collection = "enclosures")
    public List<Enclosure> enclosures;

    // List of IDs of attached animals
    @DocumentReference(collection = "animals")
    public List<AnimalCustom> animals;

    public String title;

    public List<String> farms;


    public String description;

    // List of IDs of attached people
    public List<String> attachedPeople;

    public Boolean allDay;

    public ZonedDateTime start;
    public ZonedDateTime end;

    @Nullable private String id;

    public abstract String get_id();

    public abstract List<EventInstance> nextOccurences(@NonNull ZonedDateTime from, @Nullable Integer num);

    public abstract List<EventInstance> occurencesBetween(@NonNull ZonedDateTime from, @NonNull ZonedDateTime to);
}
