package cityfarm.api.animals;

import jakarta.annotation.Nonnull;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.time.ZonedDateTime;

/**
 * Represents a non-specific goat
 */

public class GoatGeneric extends AnimalGeneric{
    //public Boolean tb_inoculated;
    //public String origin
    //public int eartagsID?

    public GoatGeneric(@Nullable String name, @Nullable String mother, @Nullable String father, @Nullable String breed, @Nonnull Boolean alive, @NonNull Boolean male, @Nullable ZonedDateTime dateOfBirth, @Nullable String notes) {
        super(name, mother, father, breed, alive, male, dateOfBirth, notes);
    }
}