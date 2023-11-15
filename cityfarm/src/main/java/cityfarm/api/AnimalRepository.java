package cityfarm.api;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import java.util.List;


@Component
@Repository
public interface AnimalRepository extends MongoRepository<AnimalGeneric, String> {
    List<AnimalGeneric> findAnimalByName(String name);

    @Query("{ '_id': ?0}")
    AnimalGeneric findAnimalById(String id);
}