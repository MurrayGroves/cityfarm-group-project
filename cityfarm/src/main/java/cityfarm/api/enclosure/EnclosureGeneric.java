package cityfarm.api.enclosure;

import cityfarm.api.AnimalGeneric;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.util.HashMap;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Document("enclosures")
public class EnclosureGeneric {
    /**
     * A mapping of animal type to how many of that type the enclosure can hold.
     * Can be null if capacity is irrelevant
     */
    @Nullable
    public HashMap<String, Integer> capacities;

    /**
     *  A mapping of animal types to lists of animals that the enclosure is holding
     */
    @NonNull
    public HashMap<String, Set<AnimalGeneric>> holding;

    @NonNull
    public String name;

    /**
     * Create new enclosure with no animals, and irrelevant capacity
     */
    public EnclosureGeneric(@NonNull String name) {
        this.holding = new HashMap<>();
        this.name = name;
    }

    /**
     * Create new enclosure
     * @param capacities sets the {@link EnclosureGeneric#capacities capacities} field
     * @param holding sets the {@link EnclosureGeneric#holding holding} field, initialising it as empty if null
     */
    public EnclosureGeneric(@NonNull String name, @Nullable HashMap<String, Integer> capacities, @Nullable HashMap<String, Set<AnimalGeneric>> holding) {
        this.capacities = capacities;
        this.holding = Objects.requireNonNullElse(holding, new HashMap<>());
        this.name = name;
    }
}
