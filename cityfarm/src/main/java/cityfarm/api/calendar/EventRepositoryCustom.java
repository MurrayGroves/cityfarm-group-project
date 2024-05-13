package cityfarm.api.calendar;

import cityfarm.api.enclosure.Enclosure;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Component;

import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.List;

@Component
public class EventRepositoryCustom {
    private final MongoOperations mongoOperations;

    public EventRepositoryCustom(MongoOperations mongoOperations) {
        this.mongoOperations = mongoOperations;
    }

    public List<Event> findAfter(ZonedDateTime after) {
        Query query = new Query(Criteria.where("end").gt(after).orOperator(Criteria.where("start").gt(after)));
        return mongoOperations.find(query, Event.class);
    }

    public List<Event> findBetween(ZonedDateTime after, ZonedDateTime before) {
        System.out.println(before.toString());
        BasicQuery query = new BasicQuery("{$or: \n" +
                "    [\n" +
                String.format("        {end: {$lt: ISODate(\"%s\")}},\n", before.toString()) +
                "        {$or: [\n" +
                String.format("            {start: {$gt: ISODate(\"%s\")}},\n", after.toString()) +
                "            {$and: [\n" +
                String.format("                {firstStart: {$lt: ISODate(\"%s\")}},\n", before.toString()) +
                String.format("                {finalEnd: {$gt: ISODate(\"%s\")}}\n", after.toString()) +
                "            ]}\n" +
                "        ]}\n" +
                "    ]\n" +
                "}");

        return mongoOperations.find(query, Event.class);
    }

    public List<Event> findEventByTitle(String title){
        Criteria regex = Criteria.where("title").regex(title, "i");
        return mongoOperations.find(new Query().addCriteria(regex), Event.class);
    }
}
