package cityfarm.api.animals;

import jakarta.annotation.Nonnull;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.time.ZonedDateTime;

/**
 * Represents a non-specific sheep
 */

@Document("animals")
public class SheepGeneric extends AnimalGeneric{
    //public Boolean tb_inoculated;
    //public int eartagsID?
    //public String origin

    public SheepGeneric(@Nullable String name, @Nullable String mother, @Nullable String father, @Nullable String breed, @Nonnull Boolean alive, @NonNull Boolean male, @Nullable ZonedDateTime dateOfBirth) {
        super(name, mother, father, breed, alive, male, dateOfBirth);
    }
}

