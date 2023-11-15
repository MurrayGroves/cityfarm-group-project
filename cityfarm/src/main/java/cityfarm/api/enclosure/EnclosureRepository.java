package cityfarm.api.enclosure;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Component;

import java.util.List;


@Component
public interface EnclosureRepository extends MongoRepository<EnclosureGeneric, String> {
    List<EnclosureGeneric> findEnclosureByName(String name);

    @Query("{ '_id': ?0}")
    Enclosure findEnclosureById(String id);
}