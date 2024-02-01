package cityfarm.api.schemas;

import cityfarm.api.animals.AnimalGeneric;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Document("schemas")
@Repository
public interface SchemaRepository extends MongoRepository<AnimalSchema, String> {
    AnimalSchema findSchemaByName(String name);
}