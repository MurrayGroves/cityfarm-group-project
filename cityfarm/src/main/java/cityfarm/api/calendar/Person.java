package cityfarm.api.calendar;

import org.springframework.data.annotation.Id;
import org.springframework.lang.NonNull;

import java.util.UUID;

public class Person {
    @Id
    @NonNull
    private final UUID id;

    public String name;

    public Person(@NonNull String id, @NonNull String name) {
        this.id = UUID.fromString(id);
        this.name = name;
    }

    public Person(@NonNull String name) {
        this.name = name;
        this.id = UUID.randomUUID();
    }

    public UUID get_id() {
        return this.id;
    }

}
