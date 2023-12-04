package cityfarm.api.enclosure;

import cityfarm.api.animals.AnimalGeneric;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.*;

@RestController
public class EnclosureController {
    @Autowired
    EnclosureRepository enclosureRepository;

    @Autowired
    EnclosureRepositoryCustom enclosureRepositoryCustom;

    @Autowired
    MongoTemplate mongoTemplate;

    @PostMapping("/api/enclosures/create")
    public ResponseEntity<Enclosure> create_enclosure(@RequestBody EnclosureGeneric enclosureReq) {

        Enclosure enclosure = new Enclosure(enclosureReq);

        enclosureRepository.save(enclosure);

        String location = String.format("/enclosures/by_id/%s", enclosure.get_id());
        return ResponseEntity.created(URI.create(location)).body(enclosure);
    }

    @GetMapping("/api/enclosures")
    public List<Enclosure> get_enclosures() {
        return enclosureRepository.findAll();
    }

    @GetMapping("/api/enclosures/by_id/{id}")
    public ResponseEntity<Enclosure> get_enclosure_by_id(@PathVariable String id) {
        Enclosure enclosure = enclosureRepository.findEnclosureById(id);

        if (enclosure == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().body(enclosure);
    }

    @GetMapping("/api/enclosures/by_name/{name}")
    public ResponseEntity<List<Enclosure>> get_enclosure_by_name(@PathVariable String name) {
        List<Enclosure> enclosure = enclosureRepository.findEnclosureByName(name);

        return ResponseEntity.ok().body(enclosure);
    }

    @PatchMapping("/api/enclosures/by_id/{id}/holding")
    public ResponseEntity<String> set_enclosure_holding(@PathVariable String id, @RequestBody HashMap<String, Set<AnimalGeneric>> holding) {
        Enclosure enc = enclosureRepository.findEnclosureById(id);

        for (String type : holding.keySet()) {
            if (!enc.capacities.containsKey(type)) {
                continue;
            }
            if (holding.get(type).size() > enc.capacities.get(type)) {
                return ResponseEntity.badRequest().body("Holding exceeds capacity");
            }
        }

        long res = enclosureRepositoryCustom.updateHolding(id, holding);

        // If no documents updated
        if (res == 0) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().build();
    }

    @PatchMapping("/api/enclosures/by_id/{id}/capacities")
    public ResponseEntity<String> set_enclosure_capacities(@PathVariable String id, @RequestBody HashMap<String, Integer> capacities) {
        Enclosure enc = enclosureRepository.findEnclosureById(id);

        for (String type : capacities.keySet()) {
            Set<AnimalGeneric> holds = Objects.requireNonNullElse(enc.holding.get(type), new HashSet<>());
            if (holds.size() > capacities.get(type)) {
                return ResponseEntity.badRequest().body("Capacity too low for current inhabitants");
            }
        }

        long res = enclosureRepositoryCustom.updateCapacities(id, capacities);

        // If no documents updated
        if (res == 0) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().build();
    }
}
