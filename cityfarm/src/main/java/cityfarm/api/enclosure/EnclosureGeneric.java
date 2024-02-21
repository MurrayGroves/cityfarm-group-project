package cityfarm.api.enclosure;

import cityfarm.api.animals.AnimalCustom;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Document("enclosures")
public class EnclosureGeneric {
    /**
     * A mapping of animal type to how many of that type the enclosure can hold.
     * Can be null if capacity is irrelevant
     */
    @Nullable
    public HashMap<String, Integer> capacities;

    /**
     *  A list of animals that the enclosure is holding
     */
    @DocumentReference(collection = "animals")
    @NonNull
    public List<AnimalCustom> holding;
    /**
     * String for the name of the enclosure
     */
    @NonNull
    public String name;
    /**
     * String for notes related to the enclosure
     */
    @Nullable
    public String notes;

    /**
     * Create new enclosure with no animals, and irrelevant capacity
     */
    public EnclosureGeneric(@NonNull String name) {
        this.holding = new ArrayList<>();
        this.name = name;
    }

    /**
     * Create new enclosure
     * @param capacities sets the {@link EnclosureGeneric#capacities capacities} field
     * @param holding sets the {@link EnclosureGeneric#holding holding} field, initialising it as empty if null
     */
    public EnclosureGeneric(@NonNull String name, @Nullable HashMap<String, Integer> capacities, @Nullable List<AnimalCustom> holding, @Nullable String notes) {
        this.capacities = capacities;
        this.holding = holding;
        this.name = name;
        this.notes = notes;
    }
}
