package cityfarm.api.schemas;

import cityfarm.api.animals.AnimalCreateRequest;
import cityfarm.api.animals.AnimalCustom;
import cityfarm.api.schemas.SchemaValue;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;


@Document("animal_schemas")
public class AnimalSchema {
    @NonNull
    @Id
    private final String name;

    @NonNull
    private final Map<String, SchemaValue> fields;

    @JsonCreator
    @PersistenceCreator
    public AnimalSchema(@NonNull String name, @NonNull Map<String, SchemaValue> fields) {
        this.name = name;
        this.fields = fields;
    }

    public String get_name() {
        return this.name;
    }

    public Map<String, SchemaValue> get_fields() {
        return this.fields;
    }

    public AnimalCustom new_animal(@NonNull AnimalCreateRequest animalReq) {
        ObjectMapper mapper = new ObjectMapper();
        List<String> keys = new ArrayList<>();
        animalReq.fields = Objects.requireNonNullElse(animalReq.fields, JsonNodeFactory.instance.objectNode());
        animalReq.fields.fields().forEachRemaining((field) -> {
            String field_name = field.getKey();
            keys.add(field_name);
            if (this.fields.get(field_name) == null) {
                throw new IllegalArgumentException(String.format("`fields` contains a key `%s` that is not in the schema", field_name));
            }

            try {
                mapper.treeToValue(field.getValue(), this.fields.get(field_name).get_type());
            } catch (JsonProcessingException e) {
                throw new IllegalArgumentException(String.format("`%s` is not of type %s", field_name, this.fields.get(field_name).get_type()));
            }
        });

        this.fields.keySet().forEach((key) -> {
            if (!keys.contains(key)) {
                throw new IllegalArgumentException(String.format("`fields` is missing required field `%s` from schema `%s`", key, this.name));
            }
        });

        return new AnimalCustom(this, animalReq);
    }
}
