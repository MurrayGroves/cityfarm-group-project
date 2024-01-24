package cityfarm.api.calendar;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Document("events")
public interface EventRepository extends MongoRepository<Event, String> {
    List<Event> findEventsByTitle(String title);

    @Query("{ '_id': ?0}")
    Event findEventById(String id);
}
