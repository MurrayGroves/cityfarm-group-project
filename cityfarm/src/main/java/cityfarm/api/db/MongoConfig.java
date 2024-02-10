package cityfarm.api.db;

import cityfarm.api.schemas.SchemaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;

import java.util.Arrays;

@Configuration
public class MongoConfig {
    @Bean
    public MongoCustomConversions customConversions() {
        return new MongoCustomConversions(Arrays.asList(new ZonedDateTimeWriteConverter(), new ZonedDateTimeReadConverter(),
                new ClassWriteConverter(), new ClassReadConverter(),
                new JsonNodeWriteConverter(), new JsonNodeReadConverter()
                ));
    }
}