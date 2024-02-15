package cityfarm.api.animals;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Document("animals")
@Repository
public interface AnimalRepository extends MongoRepository<AnimalCustom, String> {
    List<AnimalCustom> findAnimalByName(String name);

    @Query("{ '_id': ?0}")
    AnimalCustom findAnimalById(String id);
}