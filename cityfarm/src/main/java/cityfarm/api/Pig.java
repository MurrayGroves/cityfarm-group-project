package cityfarm.api;

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
 * Represents a specific & unique pig
 */
@JsonTypeName("pig")
@Document("animals")
public class Pig extends PigGeneric implements AnimalUnique{
    @Id
    private final String id;
    /**
     * UNIX timestamp the animal was added to the app at
     */
    private final long created_at;


    @JsonCreator
    @PersistenceCreator
    public Pig(@JsonProperty("_id") @Nullable String id, @JsonProperty("name") @Nullable String name, @JsonProperty("mother") @Nullable String mother, @JsonProperty("father") @Nullable String father, @JsonProperty("breed") @NonNull String breed, @JsonProperty("created_at") @Nullable Long created_at, @JsonProperty("alive") @NonNull Boolean alive, @JsonProperty("male") @NonNull Boolean male, @JsonProperty("dateOfBirth") @NonNull ZonedDateTime dateOfBirth, @JsonProperty("origin") @NonNull String origin, @JsonProperty("notes") @Nullable String notes) {
        // Construct pigGeneric
        super(name, mother, father, breed, alive, male, dateOfBirth, origin, notes);

        // Generate `ID` and `created_at` if not present
        this.id = Objects.requireNonNullElseGet(id, () -> UUID.randomUUID().toString());
        this.created_at = Objects.requireNonNullElseGet(created_at, () -> System.currentTimeMillis() / 1000);
    }

    /**
     * Copy a generic pig template to a specific pig
     * @param pig generic pig to copy attributes from
     * @param id the unique ID of the new pig, leave null to generate (recommended unless
     * @param created_at the current timestamp/creation date of this pig, leave null to generate (recommended)
     */
    public Pig(@NonNull PigGeneric pig, @Nullable String id, @Nullable Long created_at) {
        // Construct pigGeneric with existing pig's properties
        super(pig.name, pig.mother, pig.father, pig.breed, pig.alive, pig.male, pig.dateOfBirth, pig.origin, pig.notes);

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

