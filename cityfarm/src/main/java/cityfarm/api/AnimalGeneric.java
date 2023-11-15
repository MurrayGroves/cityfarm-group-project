package cityfarm.api;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

import java.util.Objects;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(value = Cow.class, name = "cow"),
        @JsonSubTypes.Type(value = Sheep.class, name = "sheep"),
        @JsonSubTypes.Type(value = Chicken.class, name = "chicken")
})
public abstract class AnimalGeneric {
    /**
     * Specific Animal's name, e.g. "Alice"
     */
    @Nullable
    public String name;
    /**
     * Optional String that contains the ID of the Animal's mother.
     */
    @Nullable
    public String mother;
    /**
     * Optional String that contains the ID of the Animal's father.
     */
    @Nullable
    public String father;
    /**
     * Boolean that reflects whether the animal is alive or dead. Dead animals don't need to show in the UI but may need to be in the database.
     * e.g. an Animal may have a dead mother who will still need to be in the database, so we can fetch the name
     */
    @NonNull
    public Boolean alive;

    public AnimalGeneric(@Nullable String name, @Nullable String mother, @Nullable String father, @NonNull Boolean alive) {
        this.name = name;
        this.mother = mother;
        this.father = father;
        this.alive = Objects.requireNonNull(alive);
    }

}

