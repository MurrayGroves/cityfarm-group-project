package cityfarm;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Vehicle {
    public Integer wheels;
    public String name;

    @JsonCreator
    public Vehicle(@JsonProperty("wheels") int wheels, @JsonProperty("name") String name) {
        this.wheels = wheels;
        this.name = name;
    }
}
