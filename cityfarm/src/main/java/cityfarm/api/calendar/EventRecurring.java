package cityfarm.api.calendar;


import com.mongodb.lang.NonNull;
import org.springframework.lang.Nullable;

import java.time.*;
import java.util.*;

public class EventRecurring extends Event {
    private final ZonedDateTime firstStart;
    private final ZonedDateTime firstEnd;

    private final Duration delay;

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
            EventInstance event = new EventInstance(currentDatetime, currentDatetime.plus(delay));
            events.add(event);
            currentDatetime = currentDatetime.plus(delay);
        }

        return events;
    }

    @Override
    public List<EventInstance> occurencesBetween(@Nullable ZonedDateTime from, @Nullable ZonedDateTime to) {
        return null;
    }

    public EventRecurring(@NonNull ZonedDateTime firstStart,  @NonNull ZonedDateTime firstEnd, @NonNull Duration delay) {
        this.firstStart = firstStart;
        this.firstEnd = firstEnd;
        this.delay = delay;
    }
}
