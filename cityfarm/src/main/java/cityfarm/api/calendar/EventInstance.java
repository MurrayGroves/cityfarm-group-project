package cityfarm.api.calendar;

import java.time.ZonedDateTime;
import com.mongodb.lang.NonNull;

public class EventInstance {
    public ZonedDateTime start;
    public ZonedDateTime end;

    public EventInstance(@NonNull ZonedDateTime start, @NonNull ZonedDateTime end) {
        this.start = start;
        this.end = end;
    }
}
