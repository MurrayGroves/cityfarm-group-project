package cityfarm.api.animals;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.time.ZonedDateTime;
import java.util.Map;

@Document("animal_schemas")
public class AnimalSchema {
    @NonNull
    private final String name;

    @NonNull
    private final Map<String, Class> fields;

    public AnimalSchema(@NonNull String name, @NonNull Map<String, Class> fields) {
        this.name = name;
        this.fields = fields;
    }

    public String get_name() {
        return this.name;
    }

    public Map<String, Class> get_fields() {
        return this.fields;
    }

    public AnimalCustom new_animal(@Nullable JsonNode fields, @Nullable String id, @Nullable String name, @Nullable String mother, @Nullable String father, @Nullable String breed, @NonNull Boolean alive, @NonNull Boolean male, @Nullable ZonedDateTime dateOfBirth, @Nullable String notes) {
        boolean is_valid = true;
        // TODO - Logic to validate `fields` against the schema
        if (!is_valid) {
            throw new IllegalArgumentException("`fields` does not match the schema");
        }

        return new AnimalCustom(id, name, mother, father, breed, alive, male, dateOfBirth, notes);
    }
}
