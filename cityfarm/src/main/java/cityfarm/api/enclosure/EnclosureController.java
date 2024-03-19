package cityfarm.api.enclosure;

import cityfarm.api.animals.AnimalCustom;
import cityfarm.api.animals.AnimalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://cityfarm.murraygrov.es"}, methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.PATCH})
public class EnclosureController {
    @Autowired
    EnclosureRepository enclosureRepository;

    @Autowired
    EnclosureRepositoryCustom enclosureRepositoryCustom;

    @Autowired
    AnimalRepository animalRepository;

    @Autowired
    MongoTemplate mongoTemplate;

    //HttpHeaders responseHeaders = new HttpHeaders();

    @PostMapping("/api/enclosures/create")
    public ResponseEntity<Enclosure> create_enclosure(@RequestBody CreateEnclosureRequest enclosure) {

        List<AnimalCustom> holding = new ArrayList<>();
        for (String animal: enclosure.holding) {
            AnimalCustom anm = animalRepository.findAnimalById(animal);
            holding.add(anm);
        }

        Enclosure new_enclosure = new Enclosure(enclosure.name, enclosure.capacities, holding, enclosure.notes, enclosure.farm);

        enclosureRepository.save(new_enclosure);

        String location = String.format("/enclosures/by_id/%s", new_enclosure.get_id());
        return ResponseEntity.created(URI.create(location)).body(new_enclosure);
    }

    @GetMapping("/api/enclosures")
    public ResponseEntity<List<Enclosure>> get_enclosures(@RequestParam("farm") @Nullable String farm) {
        List<Enclosure> enclosures = enclosureRepository.findAll();
        if (farm != null) {
            enclosures = enclosures
                    .stream()
                    .filter((enclosure) -> enclosure.farm.equals(farm))
                    .toList();
        }

        return ResponseEntity.ok().body(enclosures);
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
    public ResponseEntity<List<Enclosure>> get_enclosure_by_name(@PathVariable String name, @RequestParam("farm") @Nullable String farm) {
        List<Enclosure> enclosures = enclosureRepositoryCustom.findEnclosureByName(name);
        if (farm != null) {
            enclosures = enclosures
                    .stream()
                    .filter((enclosure) -> enclosure.farm.equals(farm))
                    .toList();
        }

        return ResponseEntity.ok().body(enclosures);
    }

//    @PatchMapping("/api/enclosures/by_id/{id}/holding")
//    public ResponseEntity<String> set_enclosure_holding(@PathVariable String id, @RequestBody List<AnimalCustom> holding) {
//        Enclosure enc = enclosureRepository.findEnclosureById(id);
//
//        for (String type : holding.keySet()) {
//            if (!enc.capacities.containsKey(type)) {
//                continue;
//            }
//            if (holding.get(type).size() > enc.capacities.get(type)) {
//                return ResponseEntity.badRequest().body("Holding exceeds capacity");
//            }
//        }
//
//        long res = enclosureRepositoryCustom.updateHolding(id, holding);
//
//        // If no documents updated
//        if (res == 0) {
//            return ResponseEntity.notFound().build();
//        }
//
//        return ResponseEntity.ok().build();
//    }

//    @PatchMapping("/api/enclosures/by_id/{id}/capacities")
//    public ResponseEntity<String> set_enclosure_capacities(@PathVariable String id, @RequestBody HashMap<String, Integer> capacities) {
//        Enclosure enc = enclosureRepository.findEnclosureById(id);
//
//        for (int i = 0; i < enc.holding.size(); i++) {
//         List<AnimalCustom> holds = new ArrayList(Objects.requireNonNullElse(enc.holding.get(type), new HashSet<>()));
//            if (holds.size() > capacities.get(type)) {
//                return ResponseEntity.badRequest().body("Capacity too low for current inhabitants");
//            }
//        }
//
//        long res = enclosureRepositoryCustom.updateCapacities(id, capacities);
//
//        // If no documents updated
//        if (res == 0) {
//            return ResponseEntity.notFound().build();
//        }
//
//        return ResponseEntity.ok().build();
//    }

    @PatchMapping("/api/enclosures/by_id/{id}/name/{newName}")
    public ResponseEntity<String> set_enclosure_name(@PathVariable String id, @PathVariable String newName) {
        //console.log("name: " + newName);

        long res = enclosureRepositoryCustom.updateName(id, newName);

        // If no documents updated
        if (res == 0) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().build();
    }
}
