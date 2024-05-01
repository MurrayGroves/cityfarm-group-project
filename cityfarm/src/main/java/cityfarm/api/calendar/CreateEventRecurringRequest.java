package cityfarm.api.calendar;

import java.time.Period;
import java.time.ZonedDateTime;
import java.util.List;

import cityfarm.api.animals.AnimalCustom;
import cityfarm.api.enclosure.Enclosure;

public class CreateEventRecurringRequest {
    public List<String> enclosures;

    public List<String> animals;

    public List<String> farms;

    public String title;

    public String description;

    public List<String> people;

    public Boolean allDay;

    public ZonedDateTime firstStart;

    public ZonedDateTime end;

    public ZonedDateTime firstEnd;

    public Period delay;
}
