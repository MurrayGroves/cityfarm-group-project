package cityfarm.api;

import com.fasterxml.jackson.annotation.JsonTypeName;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.util.Objects;
import java.util.UUID;

/**
 * Represents a specific & unique cow
 */
@JsonTypeName("cow")
public class Cow extends CowGeneric implements AnimalUnique {
    private final String id;
    /**
     * UNIX timestamp the animal was added to the app at
     */
    private final long created_at;

    public Cow(@Nullable String id, @Nullable String name, @Nullable String mother, @Nullable String father, @Nullable Long created_at, @NonNull Boolean alive, @NonNull Boolean tb_inoculated) {
        // Construct cowGeneric
        super(name, mother, father, alive, tb_inoculated);

        // Generate `ID` and `created_at` if not present
        this.id = Objects.requireNonNullElseGet(id, () -> UUID.randomUUID().toString());
        this.created_at = Objects.requireNonNullElseGet(created_at, () -> System.currentTimeMillis() / 1000);
    }

    /**
     * Copy a generic cow template to a specific cow
     * @param cow generic cow to copy attributes from
     * @param id the unique ID of the new cow, leave null to generate (recommended unless
     * @param created_at the current timestamp/creation date of this cow, leave null to generate (recommended)
     */
    public Cow(@NonNull CowGeneric cow, @Nullable String id, @Nullable Long created_at) {
        // Construct cowGeneric with existing cow's properties
        super(cow.name, cow.mother, cow.father, cow.alive, cow.tb_inoculated);

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