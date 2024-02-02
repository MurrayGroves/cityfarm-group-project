package cityfarm.api.animals;

import cityfarm.api.schemas.AnimalSchema;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.time.ZonedDateTime;
import java.util.Objects;
import java.util.UUID;

@Document("animals")
public class AnimalCustom implements AnimalUnique {
    @NonNull
    private AnimalSchema schema;

    @Nullable
    public JsonNode fields;

    @Nullable
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
    public Boolean male;
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

    public AnimalCustom(@Nullable String id, @Nullable JsonNode fields, @Nullable String name, @Nullable String mother, @Nullable String father,@Nullable String breed, @NonNull Boolean alive, @NonNull Boolean male, @Nullable ZonedDateTime dateOfBirth, @Nullable String notes) {
        this.name = name;
        this.mother = mother;
        this.father = father;
        this.breed = breed;
        this.alive = Objects.requireNonNull(alive);
        this.male = male;
        this.dateOfBirth = dateOfBirth;
        this.id = id;
        this.fields = fields;
    }

    public AnimalCustom(@NonNull AnimalCreateRequest animalReq) {
        this.id = UUID.randomUUID().toString();
        this.fields = animalReq.fields;
        this.name = animalReq.name;
        this.mother = animalReq.mother;
        this.father = animalReq.father;
        this.breed = animalReq.father;
        this.alive = animalReq.alive;
        this.male = animalReq.male;
        this.dateOfBirth = animalReq.dateOfBirth;
    }

    @Override
    public String get_id() {
        return this.id;
    }
}

