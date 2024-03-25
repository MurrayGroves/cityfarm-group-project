package cityfarm.api.enclosure;

import java.util.HashMap;
import java.util.List;

public class CreateEnclosureRequest {
    public String name;

    public List<String> holding;

    public String notes;

    public HashMap<String, Integer> capacities;

    public String farm;
}
