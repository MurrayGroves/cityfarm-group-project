package cityfarm.api;

import jakarta.annotation.Nonnull;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.time.ZonedDateTime;

public class ChickenGeneric extends AnimalGeneric {
    //public date hatchDate
    //public int batchID?


    public ChickenGeneric(@Nullable String name, @Nullable String mother, @Nullable String father, @Nullable String breed, @Nonnull Boolean alive, @NonNull Boolean male, @Nullable ZonedDateTime dateOfBirth) {
        super(name, mother, father, breed, alive, male, dateOfBirth);
    }
}
