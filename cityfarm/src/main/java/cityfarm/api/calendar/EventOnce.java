package cityfarm.api.calendar;

import com.mongodb.lang.NonNull;
import org.springframework.lang.Nullable;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

public class EventOnce extends Event {
    private ZonedDateTime datetime;

    @Override
    public List<ZonedDateTime> nextOccurences(@Nullable ZonedDateTime from, @Nullable Integer num) {
        return List.of(this.datetime);
    }
}
