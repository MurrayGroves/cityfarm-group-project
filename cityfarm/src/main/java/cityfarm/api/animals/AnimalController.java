package cityfarm.api.animals;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.autoconfigure.observation.ObservationProperties;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://cityfarm.murraygrov.es"}, methods = {RequestMethod.GET, RequestMethod.POST})
public class AnimalController {
    @Autowired
    AnimalRepository animalRepository;

    @Autowired
    AnimalRepositoryCustom animalRepositoryCustom;

    @Autowired
    MongoTemplate mongoTemplate;

    /**
     * @return a list of all animals in the DB
     */
    @GetMapping("/api/animals")
    public ResponseEntity<List<AnimalGeneric>> get_animals() {
        return ResponseEntity.ok().body(animalRepository.findAll());
    }

    /**
     * @param id ID of the animal you want to retrieve
     * @return object of the specified animal
     */
    @GetMapping("/api/animals/by_id/{id}")
    public ResponseEntity<AnimalGeneric> get_animal_by_id(@PathVariable String id) {
        AnimalGeneric animal = animalRepository.findAnimalById(id);

        if (animal == null) {
            return ResponseEntity.status(404).build();
        }

        return ResponseEntity.ok().body(animal);
    }

    /**
     * Get list of animals with a specific name
     * @param name name of the animals to search for (case-sensitive and must be exact)
     * @return list of all animals with that name
     */
    @GetMapping("/api/animals/by_name/{name}")
    public ResponseEntity<List<AnimalGeneric>> get_animals_by_name(@PathVariable String name) {
        List<AnimalGeneric> animals = animalRepositoryCustom.findAnimalByName(name);

        return ResponseEntity.ok().body(animals);
    }


    /**
     * Create new animal in app
     * @param cowReq request JSON must be in the format of a {@link CowGeneric CowGeneric} ({@link Cow Cow} but without ID and created timestamp)
     * @return the created `Cow` object
     */
    @PostMapping("/api/animals/cow/create")
    public ResponseEntity<Cow> create_animal(@RequestBody CowGeneric cowReq) {
        Cow cow = new Cow(cowReq, null, null);

        animalRepository.save(cow);

        String location = String.format("/animals/by_id/%s", cow.get_id());
        return ResponseEntity.created(URI.create(location)).body(cow);
    }

    @PostMapping("/api/animals/sheep/create")
    public ResponseEntity<Sheep> create_animal(@RequestBody SheepGeneric sheepReq) {
        Sheep sheep = new Sheep(sheepReq, UUID.randomUUID().toString(), System.currentTimeMillis() / 1000L);

        animalRepository.save(sheep);

        String location = String.format("/animals/by_id/%s", sheep.get_id());
        return ResponseEntity.created(URI.create(location)).body(sheep);
    }

    @PostMapping("/api/animals/chicken/create")
    public ResponseEntity<Chicken> create_animal(@RequestBody ChickenGeneric chickenReq) {
        Chicken chicken = new Chicken(chickenReq, UUID.randomUUID().toString(), System.currentTimeMillis() / 1000L);

        animalRepository.save(chicken);

        String location = String.format("/animals/by_id/%s", chicken.get_id());
        return ResponseEntity.created(URI.create(location)).body(chicken);
    }

    @PostMapping("/api/animals/pig/create")
    public ResponseEntity<Pig> create_animal(@RequestBody PigGeneric pigReq) {
        Pig pig = new Pig(pigReq, UUID.randomUUID().toString(), System.currentTimeMillis() / 1000L);

        animalRepository.save(pig);

        String location = String.format("/animals/by_id/%s", pig.get_id());
        return ResponseEntity.created(URI.create(location)).body(pig);
    }

    @PostMapping("/api/animals/goat/create")
    public ResponseEntity<Goat> create_animal(@RequestBody GoatGeneric goatReq) {
        Goat goat = new Goat(goatReq, UUID.randomUUID().toString(), System.currentTimeMillis() / 1000L);

        animalRepository.save(goat);

        String location = String.format("/animals/by_id/%s", goat.get_id());
        return ResponseEntity.created(URI.create(location)).body(goat);
    }
}
