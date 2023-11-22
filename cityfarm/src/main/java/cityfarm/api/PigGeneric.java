package cityfarm.api;

import jakarta.annotation.Nonnull;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.time.ZonedDateTime;

/**
 * Represents a non-specific pig
 */

public class PigGeneric extends AnimalGeneric{
    public String origin;

    public PigGeneric(@Nullable String name, @Nullable String mother, @Nullable String father, @Nullable String breed, @Nonnull Boolean alive, @NonNull Boolean male, @Nullable ZonedDateTime dateOfBirth, @NonNull String origin, @Nullable String notes) {
        super(name, mother, father, breed, alive, male, dateOfBirth, notes);
        this.origin = origin;
    }
}