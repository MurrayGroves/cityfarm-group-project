package cityfarm.api;

import jakarta.annotation.Nonnull;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

/**
 * Represents a non-specific cow
 */
public class CowGeneric extends AnimalGeneric {
    @NonNull
    public boolean tb_inoculated;

    public CowGeneric(@Nullable String name, @Nullable String mother, @Nullable String father, @Nonnull Boolean alive, @NonNull Boolean tb_inoculated) {
        super(name, mother, father, alive);
        this.tb_inoculated = tb_inoculated;
    }
}
