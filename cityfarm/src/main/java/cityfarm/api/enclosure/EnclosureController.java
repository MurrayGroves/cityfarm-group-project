package cityfarm.api.enclosure;

import cityfarm.api.animals.AnimalCustom;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpHeaders;
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

    HttpHeaders responseHeaders = new HttpHeaders();

    @PostMapping("/api/enclosures/create")
    public ResponseEntity<Enclosure> create_enclosure(@RequestBody EnclosureGeneric enclosureReq) {

        Enclosure enclosure = new Enclosure(enclosureReq);

        enclosureRepository.save(enclosure);

        String location = String.format("/enclosures/by_id/%s", enclosure.get_id());
        return ResponseEntity.created(URI.create(location)).body(enclosure);
    }

    @GetMapping("/api/enclosures")
    public ResponseEntity<List<Enclosure>> get_enclosures() {
        responseHeaders.set(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:3000");
        return ResponseEntity.ok().headers(responseHeaders).body(enclosureRepository.findAll());
    }

    @GetMapping("/api/enclosures/by_id/{id}")
    public ResponseEntity<Enclosure> get_enclosure_by_id(@PathVariable String id) {
        responseHeaders.set(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:3000");
        Enclosure enclosure = enclosureRepository.findEnclosureById(id);

        if (enclosure == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().headers(responseHeaders).body(enclosure);
    }

    @GetMapping("/api/enclosures/by_name/{name}")
    public ResponseEntity<List<Enclosure>> get_enclosure_by_name(@PathVariable String name) {
        responseHeaders.set(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:3000");
        List<Enclosure> enclosure = enclosureRepositoryCustom.findEnclosureByName(name);

        return ResponseEntity.ok().headers(responseHeaders).body(enclosure);
    }

    @PatchMapping("/api/enclosures/by_id/{id}/holding")
    public ResponseEntity<String> set_enclosure_holding(@PathVariable String id, @RequestBody HashMap<String, Set<AnimalCustom>> holding) {
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
            Set<AnimalCustom> holds = Objects.requireNonNullElse(enc.holding.get(type), new HashSet<>());
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

    @PatchMapping("/api/enclosures/by_id/{id}/name")
    public ResponseEntity<String> set_enclosure_name(@PathVariable String id, @RequestBody String name) {

        long res = enclosureRepositoryCustom.updateName(id, name);

        // If no documents updated
        if (res == 0) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().build();
    }
}
