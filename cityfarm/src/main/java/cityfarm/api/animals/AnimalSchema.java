package cityfarm.api.animals;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    private final String name;

    @NonNull
    private final Map<String, SchemaValue> fields;

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

    public AnimalCustom new_animal(@Nullable JsonNode fields, @Nullable String id, @Nullable String name, @Nullable String mother, @Nullable String father, @Nullable String breed, @NonNull Boolean alive, @NonNull Boolean male, @Nullable ZonedDateTime dateOfBirth, @Nullable String notes) {
        boolean is_valid = true;
        // TODO - Logic to validate `fields` against the schema
        ObjectMapper mapper = new ObjectMapper();
        List<String> keys = new ArrayList<>();
        fields.fields().forEachRemaining((field) -> {
            String field_name = field.getKey();
            keys.add(field_name);
            if (this.fields.get(field_name) == null) {
                throw new IllegalArgumentException("`fields` contains a key that is not in the schema");
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

        if (!is_valid) {
            throw new IllegalArgumentException("`fields` does not match the schema");
        }

        return new AnimalCustom(id, name, mother, father, breed, alive, male, dateOfBirth, notes);
    }
}
