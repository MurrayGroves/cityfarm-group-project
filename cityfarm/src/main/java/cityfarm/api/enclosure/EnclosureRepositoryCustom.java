package cityfarm.api.enclosure;

import cityfarm.api.animals.AnimalCustom;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Set;

@Component
public class EnclosureRepositoryCustom {

    private final MongoOperations mongoOperations;

    public EnclosureRepositoryCustom(MongoOperations mongoOperations) {
        this.mongoOperations = mongoOperations;
    }

    public long updateHolding(String id, HashMap<String, Set<AnimalCustom>> holding) {
        Query query = new Query(Criteria.where("_id").is(id));
        Update update = new Update().set("holding", holding);
        return mongoOperations.updateFirst(query, update, Enclosure.class).getModifiedCount();
    } 

    public long updateCapacities(String id, HashMap<String, Integer> capacities) {
        Query query = new Query(Criteria.where("_id").is(id));
        Update update = new Update().set("capacities", capacities);
        return mongoOperations.updateFirst(query, update, Enclosure.class).getModifiedCount();
    }

    public long updateName(String id, String name) {
        Query query = new Query(Criteria.where("_id").is(id));
        Update update = new Update().set("name", name);
        return mongoOperations.updateFirst(query, update, Enclosure.class).getModifiedCount();
    }

     public List<Enclosure> findEnclosureByName(String name){
        Criteria regex = Criteria.where("name").regex(name, "i");
        return mongoOperations.find(new Query().addCriteria(regex), Enclosure.class);
    }
}