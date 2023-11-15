package cityfarm.api;

import jakarta.annotation.Nonnull;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.validation.annotation.Validated;

import java.util.Objects;

/**
 * Represents a non-specific cow
 */
@Validated
public class CowGeneric extends AnimalGeneric {
    @NonNull
    public Boolean tb_inoculated;

    public CowGeneric(@Nullable String name, @Nullable String mother, @Nullable String father, @Nonnull Boolean alive, @NonNull Boolean tb_inoculated) {
        super(name, mother, father, alive);
        this.tb_inoculated = Objects.requireNonNull(tb_inoculated);
    }

}
