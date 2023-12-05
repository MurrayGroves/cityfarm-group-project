package cityfarm.api.calendar;

import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

public class EventOnce extends Event {
    @Override
    public List<EventInstance> nextOccurences(@Nullable ZonedDateTime from, @Nullable Integer num) {
        return List.of(new EventInstance(start, end, this));
    }

    @Override
    public List<EventInstance> occurencesBetween(@NonNull ZonedDateTime from, @NonNull ZonedDateTime to) {
        if (from.isBefore(start) || to.isAfter(end)) {
            return List.of(new EventInstance(start, end, this));
        } else {
            return List.of();
        }
    }
}
