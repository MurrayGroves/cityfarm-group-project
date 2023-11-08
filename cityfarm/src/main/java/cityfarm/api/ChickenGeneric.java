package cityfarm.api;

import jakarta.annotation.Nonnull;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

public class ChickenGeneric extends AnimalGeneric {
    public Boolean tb_inoculated;

    public ChickenGeneric(@Nullable String name, @Nullable String mother, @Nullable String father, @Nonnull Boolean alive, @NonNull Boolean tb_inoculated) {
        super(name, mother, father, alive);
        this.tb_inoculated = tb_inoculated; //not needed for chickens?
    }
}
