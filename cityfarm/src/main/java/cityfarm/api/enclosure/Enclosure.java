package cityfarm.api.enclosure;

import cityfarm.api.AnimalGeneric;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.PersistenceCreator;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.util.HashMap;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Document("enclosures")
public class Enclosure extends EnclosureGeneric {
    @Id
    @NonNull
    private final String id;

    public String get_id() {
        return this.id;
    }

    @JsonCreator
    @PersistenceCreator
    public Enclosure(@NonNull String name, @Nullable HashMap<String, Integer> capacities, @Nullable HashMap<String, Set<AnimalGeneric>> holding, @JsonProperty("_id") @Nullable String id) {
        super(name, capacities, holding);

        // Generate `ID` and `created_at` if not present
        this.id = Objects.requireNonNullElseGet(id, () -> UUID.randomUUID().toString());
    }

    public Enclosure(@NonNull String name, @Nullable HashMap<String, Integer> capacities, @Nullable HashMap<String, Set<AnimalGeneric>> holding) {
        super(name, capacities, holding);

        // Generate `ID` and `created_at`
        this.id = UUID.randomUUID().toString();
    }

    public Enclosure(@NonNull String name) {
        super(name);

        // Generate `ID` and `created_at`
        this.id = UUID.randomUUID().toString();
    }

    public Enclosure(@NonNull EnclosureGeneric enc, @Nullable String id) {
        super(enc.name, enc.capacities, enc.holding);
        this.id = Objects.requireNonNullElseGet(id, () -> UUID.randomUUID().toString());
    }

    public Enclosure(@NonNull EnclosureGeneric enc) {
        super(enc.name, enc.capacities, enc.holding);
        this.id = UUID.randomUUID().toString();
    }
}
