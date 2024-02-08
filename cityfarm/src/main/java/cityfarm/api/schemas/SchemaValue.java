package cityfarm.api.schemas;

import org.springframework.lang.NonNull;

public class SchemaValue {
    @NonNull
    private final Boolean required;

    @NonNull
    private final Class type;

    public SchemaValue(@NonNull Boolean required, @NonNull Class type) {
        this.type = type;
        this.required = required;
    }

    public Boolean get_required() {
        return this.required;
    }

    public Class get_type() {
        return this.type;
    }
}
