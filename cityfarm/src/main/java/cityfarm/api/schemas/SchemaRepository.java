package cityfarm.api.schemas;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SchemaRepository extends MongoRepository<AnimalSchema, String> {
    AnimalSchema findSchemaByName(String name);

    String deleteByName(String name);
}