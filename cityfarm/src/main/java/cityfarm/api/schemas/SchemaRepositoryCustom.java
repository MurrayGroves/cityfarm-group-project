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
}