package cityfarm.api.enclosure;

import cityfarm.api.AnimalGeneric;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.util.HashMap;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

public class Enclosure extends EnclosureGeneric {
    @Id
    @NonNull
    private final String id;
    /**
     * UNIX timestamp the enclosure was added to the app at
     */
    @NonNull
    private final Long created_at;

    @JsonCreator
    @PersistenceCreator
    public Enclosure(@NonNull String name, @Nullable HashMap<String, Integer> capacities, @Nullable HashMap<String, Set<AnimalGeneric>> holding, @JsonProperty("_id") @Nullable String id, @Nullable Long created_at) {
        super(name, capacities, holding);

        // Generate `ID` and `created_at` if not present
        this.id = Objects.requireNonNullElseGet(id, () -> UUID.randomUUID().toString());
        this.created_at = Objects.requireNonNullElseGet(created_at, () -> System.currentTimeMillis() / 1000);
    }

    public Enclosure(@NonNull String name, @Nullable HashMap<String, Integer> capacities, @Nullable HashMap<String, Set<AnimalGeneric>> holding) {
        super(name, capacities, holding);

        // Generate `ID` and `created_at`
        this.id = UUID.randomUUID().toString();
        this.created_at = System.currentTimeMillis() / 1000;
    }

    public Enclosure(@NonNull String name) {
        super(name);

        // Generate `ID` and `created_at`
        this.id = UUID.randomUUID().toString();
        this.created_at = System.currentTimeMillis() / 1000;
    }
}
