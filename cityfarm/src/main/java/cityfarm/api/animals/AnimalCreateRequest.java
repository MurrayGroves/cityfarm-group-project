package cityfarm.api.animals;

import com.fasterxml.jackson.databind.JsonNode;

import java.time.ZonedDateTime;

public class AnimalCreateRequest {
    public String type;
    public JsonNode fields;

    public String name;

    public String mother;

    public String father;

    public String breed;

    public Boolean alive;

    public String sex;

    public ZonedDateTime dateOfBirth;

    public String notes;

    public String farm;
}
