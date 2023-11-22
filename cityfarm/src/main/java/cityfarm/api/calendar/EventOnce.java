package cityfarm.api.calendar;

import com.mongodb.lang.NonNull;
import org.springframework.lang.Nullable;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

public class EventOnce extends Event {
    private ZonedDateTime start;
    private ZonedDateTime end;

    @Override
    public List<EventInstance> nextOccurences(@Nullable ZonedDateTime from, @Nullable Integer num) {
        return List.of(new EventInstance(start, end));
    }

    @Override
    public List<EventInstance> occurencesBetween(@Nullable ZonedDateTime from, @Nullable ZonedDateTime to) {
        return List.of(new EventInstance(start, end));
    }
}
