package cityfarm;

import cityfarm.api.animals.AnimalSchema;
import cityfarm.api.animals.SchemaValue;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

public class SchemaTests {
    @Test
    public void reject_surplus_keys() throws JsonProcessingException {
        Map<String, SchemaValue> map = new HashMap<>();
        map.put("name", new SchemaValue(false, String.class));
        AnimalSchema schema = new AnimalSchema("test", map);

        ObjectMapper mapper = new ObjectMapper();

        JsonNode input = mapper.readTree("{\"name\": \"bob\", \"age\": 18}");
        schema.new_animal(input, null, null, null, null, null, true, true, null, null);
    }
}
