package cityfarm.api.animals;

import cityfarm.api.schemas.AnimalSchema;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.ReadOnlyProperty;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.*;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import java.time.ZonedDateTime;
import java.util.Objects;
import java.util.UUID;

@Document("animals")
public class AnimalCustom implements AnimalUnique {
    @ReadOnlyProperty
    @DocumentReference(lookup="{'_id':?#{#self.type} }", collection = "animal_schemas", lazy = true)
    private AnimalSchema schema;

    @JsonProperty("type")
    private String type;

    @Nullable
    public JsonNode fields;

    @Nullable
    @Id
    private final String id;

    /**
     * Specific Animal's name, e.g. "Alice"
     */
    @Nullable
    public String name;
    /**
     * Optional String that contains the ID of the Animal's mother.
     */
    @Nullable
    public String mother;
    /**
     * Optional String that contains the ID of the Animal's father.
     */
    @Nullable
    public String father;

    /**
     * Optional String that contains the breed of an animal
     * (perhaps make into an enum or something later on)
     */
    @Nullable
    public String breed;
    /**
     * Boolean that reflects whether the animal is alive or dead. Dead animals don't need to show in the UI but may need to be in the database.
     * e.g. an Animal may have a dead mother who will still need to be in the database, so we can fetch the name
     */
    @NonNull
    public Boolean alive;
    /**
     * Boolean that identifies the sex of an animal (true for male, false for female)
     */
    @NonNull
    public String sex;
    /**
     * Date of Birth of the animal (date of hatching for birds)
     */
    @Nullable
    public ZonedDateTime dateOfBirth;
    /**
     * Free text for notes on an animal
     */
    @Nullable
    public String notes;

    /**
     * Farm that the animal is held at
     */
    @NonNull
    public String farm;

    @PersistenceCreator
    @JsonCreator
    public AnimalCustom(@JsonProperty("type") @NonNull AnimalSchema schema, @Nullable String id, @Nullable JsonNode fields, @JsonProperty("name") @Nullable String name, @Nullable String mother, @Nullable String father, @Nullable String breed, @NonNull Boolean alive, @NonNull String sex, @Nullable ZonedDateTime dateOfBirth, @Nullable String notes, @NonNull String farm) {
        this.schema = schema;
        this.type = schema.get_name();
        this.name = name;
        this.mother = mother;
        this.father = father;
        this.breed = breed;
        this.alive = Objects.requireNonNullElse(alive, true);
        this.sex = sex;
        this.dateOfBirth = dateOfBirth;
        this.id = id;
        this.fields = Objects.requireNonNullElse(fields, JsonNodeFactory.instance.objectNode());
        this.farm = farm;
        this.notes = notes;
    }

    public AnimalCustom(@NonNull AnimalSchema schema, @NonNull AnimalCreateRequest animalReq) {
        this.schema = schema;
        this.type = schema.get_name();
        this.id = UUID.randomUUID().toString();
        this.fields = Objects.requireNonNullElse(animalReq.fields, JsonNodeFactory.instance.objectNode());
        this.name = animalReq.name;
        this.mother = animalReq.mother;
        this.father = animalReq.father;
        this.breed = animalReq.father;
        this.alive = Objects.requireNonNullElse(animalReq.alive, true);
        this.sex = animalReq.sex;
        this.dateOfBirth = animalReq.dateOfBirth;
        this.farm = animalReq.farm;
        this.notes = animalReq.notes;
    }

    @Override
    public String get_id() {
        return this.id;
    }

    public String getType() {
        return type;
    }
}

