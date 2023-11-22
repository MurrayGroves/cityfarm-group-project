package cityfarm.api;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.time.ZonedDateTime;
import java.util.Objects;
import java.util.UUID;

@Document("animals")
public class Chicken extends ChickenGeneric {
    @Id
    private final String id;
    /**
     * UNIX timestamp the animal was added to the app at
     */
    private final long created_at;

    @JsonCreator
    @PersistenceCreator
    public Chicken(@JsonProperty("_id") @Nullable String id, @JsonProperty("name") @Nullable String name, @JsonProperty("mother") @Nullable String mother, @JsonProperty("father") @Nullable String father, @JsonProperty("breed") @Nullable String breed, @JsonProperty("created_at") @Nullable Long created_at, @JsonProperty("alive") @NonNull Boolean alive, @JsonProperty("male") @NonNull Boolean male, @JsonProperty("dateOfBirth") @NonNull ZonedDateTime dateOfBirth) {
        // Construct chickenGeneric
        super(name, mother, father, breed, alive, male, dateOfBirth);

        // Generate `ID` and `created_at` if not present
        this.id = Objects.requireNonNullElseGet(id, () -> UUID.randomUUID().toString());
        this.created_at = Objects.requireNonNullElseGet(created_at, () -> System.currentTimeMillis() / 1000);
    }

    /**
     * Copy a generic chicken template to a specific chicken
     * @param chicken generic chicken to copy attributes from
     * @param id the unique ID of the new chicken, leave null to generate (recommended unless
     * @param created_at the current timestamp/creation date of this chicken, leave null to generate (recommended)
     */
    public Chicken(@NonNull ChickenGeneric chicken, @Nullable String id, @Nullable Long created_at) {
        // Construct chickenGeneric with existing chicken's properties
        super(chicken.name, chicken.mother, chicken.father, chicken.breed, chicken.alive, chicken.male, chicken.dateOfBirth);

        // Generate `ID` and `created_at` if not present
        this.id = Objects.requireNonNullElseGet(id, () -> UUID.randomUUID().toString());
        this.created_at = Objects.requireNonNullElseGet(created_at, () -> System.currentTimeMillis() / 1000);
    }

    public String get_id() {
        return id;
    }

    public Long get_created_at() {
        return created_at;
    }
}
