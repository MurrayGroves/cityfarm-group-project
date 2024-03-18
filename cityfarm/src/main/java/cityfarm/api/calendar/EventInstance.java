package cityfarm.api.calendar;

import java.time.ZonedDateTime;
import com.mongodb.lang.NonNull;

public class EventInstance {
    public ZonedDateTime start;
    public ZonedDateTime end;

    public Event event;

    public EventInstance(@NonNull ZonedDateTime start, @NonNull ZonedDateTime end, @NonNull Event event) {
        this.start = start;
        this.end = end;
        this.event = event;
    }

    @Override
    public String toString() {
        return String.format("Start: %s\nEnd: %s\nEvent:\n%s\n", this.start, this.end, this.event);
    }
}
