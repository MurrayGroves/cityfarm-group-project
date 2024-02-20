package cityfarm.api.calendar;

import java.time.ZonedDateTime;
import java.util.List;

public class CreateEventOnceRequest {
    public List<String> enclosures;

    public List<String> animals;

    public List<Integer> farms;

    public String title;

    public String description;

    public List<String> people;

    public Boolean all_day;

    public ZonedDateTime start;

    public ZonedDateTime end;
}
