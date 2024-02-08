package cityfarm;

import cityfarm.api.animals.AnimalCreateRequest;
import cityfarm.api.schemas.AnimalSchema;
import cityfarm.api.schemas.SchemaValue;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

import static junit.framework.TestCase.assertTrue;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.Assert.assertThrows;

public class SchemaTests {
    @Test
    public void reject_surplus_keys() throws JsonProcessingException {
        Map<String, SchemaValue> map = new HashMap<>();
        map.put("name", new SchemaValue(false, String.class));
        AnimalSchema schema = new AnimalSchema("test", map);

        ObjectMapper mapper = new ObjectMapper();

        JsonNode input = mapper.readTree("{\"name\": \"bob\", \"age\": 18}");
        AnimalCreateRequest animalReq = new AnimalCreateRequest();
        animalReq.name = "bob";
        animalReq.fields = input;
        Exception exception = assertThrows(
                IllegalArgumentException.class,
                () -> schema.new_animal(animalReq)
        );

        assertTrue(
                exception.getMessage().contains("not in the schema")
        );
    }

    @Test
    public void reject_invalid_type() throws JsonProcessingException {
        class Vehicle {
            public int wheels;
            public String name;
        }
        Map<String, SchemaValue> map = new HashMap<>();
        map.put("vehicle", new SchemaValue(false, Vehicle.class));
        AnimalSchema schema = new AnimalSchema("test", map);

        ObjectMapper mapper = new ObjectMapper();

        JsonNode input = mapper.readTree("{\"vehicle\": 13}");
        AnimalCreateRequest animalReq = new AnimalCreateRequest();
        animalReq.fields = input;
        Exception exception = assertThrows(
                IllegalArgumentException.class,
                () -> schema.new_animal(animalReq)
        );

        assertTrue(
                exception.getMessage().contains("not of type")
        );
    }

    @Test
    public void required_field_missing() throws JsonProcessingException {
        Map<String, SchemaValue> map = new HashMap<>();
        map.put("vehicle", new SchemaValue(false, Vehicle.class));
        map.put("license", new SchemaValue(true, String.class));
        AnimalSchema schema = new AnimalSchema("test", map);

        ObjectMapper mapper = new ObjectMapper();

        JsonNode input = mapper.readTree("{\"vehicle\": {\"wheels\": 4, \"name\": \"toyota\"}}");
        AnimalCreateRequest animalReq = new AnimalCreateRequest();
        animalReq.fields = input;
        Exception exception = assertThrows(
                IllegalArgumentException.class,
                () -> schema.new_animal(animalReq)
        );

        assertTrue(
                exception.getMessage().contains("missing required field")
        );
    }
}
