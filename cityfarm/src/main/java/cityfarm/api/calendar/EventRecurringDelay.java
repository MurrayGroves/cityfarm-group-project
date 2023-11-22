package cityfarm.api.calendar;


import com.mongodb.lang.NonNull;
import org.springframework.cglib.core.Local;
import org.springframework.lang.Nullable;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;

public class EventRecurringDelay extends Event {
    private final ZonedDateTime firstDatetime;

    private final Duration delay;

    @Override
    public List<ZonedDateTime> nextOccurences(@Nullable ZonedDateTime from, @Nullable Integer num) {
        List<ZonedDateTime> events = new ArrayList<>();

        from = Objects.requireNonNullElse(from, firstDatetime);
        ZonedDateTime currentDatetime = firstDatetime;

        while (currentDatetime.isBefore(from)) {
            currentDatetime = currentDatetime.plus(delay);
        }

        for (int i = 0; i < Objects.requireNonNullElse(num, 1); i++) {
            events.add(currentDatetime);
            currentDatetime = currentDatetime.plus(delay);
        }

        return events;
    }

    public EventRecurringDelay(@NonNull ZonedDateTime firstDatetime, @NonNull Duration delay) {
        this.firstDatetime = firstDatetime;
        this.delay = delay;
    }
}
