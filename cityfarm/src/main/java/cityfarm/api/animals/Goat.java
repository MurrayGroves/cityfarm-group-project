package cityfarm.api.animals;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonTypeName;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.time.ZonedDateTime;
import java.util.Objects;
import java.util.UUID;

/**
 * Represents a specific & unique goat
 */
@JsonTypeName("goat")
@Document("animals")
public class Goat extends GoatGeneric implements AnimalUnique{
    @Id
    private final String id;
    /**
     * UNIX timestamp the animal was added to the app at
     */
    private final long created_at;


    @JsonCreator
    @PersistenceCreator
    public Goat(@JsonProperty("_id") @Nullable String id, @JsonProperty("name") @Nullable String name, @JsonProperty("mother") @Nullable String mother, @JsonProperty("father") @Nullable String father, @JsonProperty("breed") @NonNull String breed, @JsonProperty("created_at") @Nullable Long created_at, @JsonProperty("alive") @NonNull Boolean alive, @JsonProperty("male") @NonNull Boolean male, @JsonProperty("dateOfBirth") @NonNull ZonedDateTime dateOfBirth) {
        // Construct goatGeneric
        super(name, mother, father, breed, alive, male, dateOfBirth);

        // Generate `ID` and `created_at` if not present
        this.id = Objects.requireNonNullElseGet(id, () -> UUID.randomUUID().toString());
        this.created_at = Objects.requireNonNullElseGet(created_at, () -> System.currentTimeMillis() / 1000);
    }

    /**
     * Copy a generic goat template to a specific goat
     * @param goat generic goat to copy attributes from
     * @param id the unique ID of the new goat, leave null to generate (recommended unless
     * @param created_at the current timestamp/creation date of this goat, leave null to generate (recommended)
     */
    public Goat(@NonNull GoatGeneric goat, @Nullable String id, @Nullable Long created_at) {
        // Construct goatGeneric with existing goat's properties
        super(goat.name, goat.mother, goat.father, goat.breed, goat.alive, goat.male, goat.dateOfBirth);

        // Generate `ID` and `created_at` if not present
        this.id = Objects.requireNonNullElseGet(id, () -> UUID.randomUUID().toString());
        this.created_at = Objects.requireNonNullElseGet(created_at, () -> System.currentTimeMillis() / 1000);
    }

    @Override
    public String get_id() {
        return id;
    }

    @Override
    public Long get_created_at() {
        return created_at;
    }
}

