package cityfarm.api;

import jakarta.annotation.Nonnull;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.validation.annotation.Validated;

import java.util.Objects;

import java.time.ZonedDateTime;

/**
 * Represents a non-specific cow
 */
@Document("animals")
@Validated
public class CowGeneric extends AnimalGeneric {
    public boolean tb_inoculated;
    //public date dateOfBirth
  
    public CowGeneric(@Nullable String name, @Nullable String mother, @Nullable String father, @Nullable String breed, @Nonnull Boolean alive, @NonNull Boolean male, @Nullable ZonedDateTime dateOfBirth, @NonNull Boolean tb_inoculated, @Nullable String notes) {
        super(name, mother, father, breed, alive, male, dateOfBirth, notes);
        this.tb_inoculated = Objects.requireNonNull(tb_inoculated);
    }

}
