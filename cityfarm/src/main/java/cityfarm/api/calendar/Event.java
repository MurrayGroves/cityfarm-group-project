package cityfarm.api.calendar;

import cityfarm.api.animals.AnimalUnique;
import cityfarm.api.enclosure.Enclosure;
import com.mongodb.lang.NonNull;
import org.springframework.lang.Nullable;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

public abstract class Event {
    public List<Enclosure> attachedEnclosures;

    public List<AnimalUnique> attachedAnimals;

    public String title;

    public String description;

    public List<Person> attachedPeople;

    public Boolean allDay;
    public LocalDateTime start;
    public LocalDateTime end;

    public abstract List<ZonedDateTime> nextOccurences(@Nullable ZonedDateTime from, @Nullable Integer num);
}
