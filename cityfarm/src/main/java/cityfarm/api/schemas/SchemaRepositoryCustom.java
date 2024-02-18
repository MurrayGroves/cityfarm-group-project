package cityfarm.api.schemas;

import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SchemaRepositoryCustom {

    private final MongoOperations mongoOperations;

    public SchemaRepositoryCustom(MongoOperations mongoOperations) {
        this.mongoOperations = mongoOperations;
    }

    public List<AnimalSchema> findSchemaByName(String name){
        Criteria regex = Criteria.where("name").regex(name, "i");
        return mongoOperations.find(new Query().addCriteria(regex), AnimalSchema.class);
    }
}