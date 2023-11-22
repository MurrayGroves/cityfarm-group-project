package cityfarm.api.calendar;

import cityfarm.api.enclosure.Enclosure;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Component;

import java.util.List;

public class EventRepository {
    @Component
    @Document("events")
    public interface EventsRepository extends MongoRepository<Enclosure, String> {
        List<Enclosure> findEventsByName(String name);

        @Query("{ '_id': ?0}")
        Enclosure findEventById(String id);
    }
}
