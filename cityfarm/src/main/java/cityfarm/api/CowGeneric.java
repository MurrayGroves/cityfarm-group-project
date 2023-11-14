package cityfarm.api;

import jakarta.annotation.Nonnull;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.time.ZonedDateTime;

/**
 * Represents a non-specific cow
 */
public class CowGeneric extends AnimalGeneric {
    //eartags (I don't know what datatype this is)
    //public date dateOfBirth

    public CowGeneric(@Nullable String name, @Nullable String mother, @Nullable String father, @Nullable String breed, @Nonnull Boolean alive, @NonNull Boolean male, @NonNull ZonedDateTime dateOfBirth) {
        super(name, mother, father, breed, alive, male, dateOfBirth);
    }

}
