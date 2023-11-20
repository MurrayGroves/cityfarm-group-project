package cityfarm.api.enclosure;

import cityfarm.api.AnimalGeneric;
import com.mongodb.client.result.UpdateResult;
import com.mongodb.internal.bulk.UpdateRequest;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.Set;


@Component
@Document("enclosures")
public interface EnclosureRepository extends MongoRepository<Enclosure, String> {
    List<Enclosure> findEnclosureByName(String name);

    @Query("{ '_id': ?0}")
    Enclosure findEnclosureById(String id);
}