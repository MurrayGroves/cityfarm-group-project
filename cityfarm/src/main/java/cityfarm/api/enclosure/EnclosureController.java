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
import java.util.Objects;

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

//    THIS CODE DOESN'T WORK ANY MORE, NEEDS TO BE ADAPTED
    
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

    @PatchMapping("/api/enclosures/by_id/{id}/update")
    public ResponseEntity<String> set_enclosure_new(@PathVariable String id, @RequestBody CreateEnclosureRequest enclosureNew) {

        List<AnimalCustom> holding = new ArrayList<>();
        for (String animal: enclosureNew.holding) {
            AnimalCustom anm = animalRepository.findAnimalById(animal);
            holding.add(anm);
        }
        long res1 = enclosureRepositoryCustom.updateName(id, enclosureNew.name);
        long res2 = enclosureRepositoryCustom.updateHolding(id,holding);
        long res3 = enclosureRepositoryCustom.updateCapacities(id,enclosureNew.capacities);

        // TODO an error check


        return ResponseEntity.ok().build();
    }

    @PatchMapping("/api/enclosures/moveanimal")
    public ResponseEntity<String> change_animal_enclosure( @RequestBody List<String> ids){
        String anId = ids.get(0);
        String toId = ids.get(1);
        String fromId = ids.get(2);

        //gets the animal

        AnimalCustom animal = animalRepository.findAnimalById(anId);

        //defines home and destination nd also where the animal is getting removed from, can probs be done more elegantly
        Enclosure fromEnclosure = enclosureRepository.findEnclosureById(fromId);
        int removalPoint = -1;
        for (AnimalCustom a: fromEnclosure.holding) {
            if (Objects.equals(a.get_id(), animal.get_id())){
                removalPoint = fromEnclosure.holding.indexOf(a);
            }
        }
//        if (removalPoint == -1){
//            return ResponseEntity.notFound().build();
//        }


        Enclosure toEnclosure = enclosureRepository.findEnclosureById(toId);

        //checks it's found both enclosures
//        if (fromEnclosure == null || toEnclosure== null){
//            return ResponseEntity.notFound().build();
//        }

        //removes then adds the animal
        fromEnclosure.holding.remove(removalPoint);
        long remove = enclosureRepositoryCustom.updateHolding(fromId,fromEnclosure.holding);
        toEnclosure.holding.add(animal);
        long add = enclosureRepositoryCustom.updateHolding(toId,toEnclosure.holding);



        return ResponseEntity.ok().build();
    }
}
