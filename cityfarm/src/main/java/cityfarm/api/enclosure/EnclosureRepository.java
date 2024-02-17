package cityfarm.api.enclosure;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Component;

import java.util.List;


@Component
@Document("enclosures")
public interface EnclosureRepository extends MongoRepository<Enclosure, String> {
    List<Enclosure> findEnclosureByName(String name);

    @Query("{ '_id': ?0}")
    Enclosure findEnclosureById(String id);

}