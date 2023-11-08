package cityfarm.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
public class AnimalController {
    @Autowired
    AnimalRepository animalRepository;

    @Autowired
    MongoTemplate mongoTemplate;

    /**
     * @return a list of all animals in the DB
     */
    @GetMapping("/animals")
    public List<AnimalGeneric> get_animals() {
        return animalRepository.findAll();
    }

    /**
     * @param id ID of the animal you want to retrieve
     * @return object of the specified animal
     */
    @GetMapping("/animals/by_id/{id}")
    public ResponseEntity<AnimalGeneric> get_animal_by_id(@PathVariable String id) {
        AnimalGeneric animal = animalRepository.findAnimalById(id);

        return ResponseEntity.ok().body(animal);
    }

    /**
     * Get list of animals with a specific name
     * @param name name of the animals to search for (case-sensitive and must be exact)
     * @return list of all animals with that name
     */
    @GetMapping("/animals/by_name/{name}")
    public ResponseEntity<List<AnimalGeneric>> get_animals_by_name(@PathVariable String name) {
        List<AnimalGeneric> animals = animalRepository.findAnimalByName(name);

        return ResponseEntity.ok().body(animals);
    }


    /**
     * Create new animal in app
     * @param cowReq request JSON must be in the format of a {@link CowGeneric CowGeneric} ({@link Cow Cow} but without ID and created timestamp)
     * @return the created `Cow` object
     */
    @PostMapping("/animals/create")
    public ResponseEntity<Cow> create_animal(@RequestBody CowGeneric cowReq) {

        Cow cow = new Cow(cowReq, UUID.randomUUID().toString(), System.currentTimeMillis() / 1000L);

        animalRepository.save(cow);

        String location = String.format("/animals/by_id/%s", cow.get_id());
        return ResponseEntity.created(URI.create(location)).body(cow);
    }

    public ResponseEntity<Sheep> create_animal(@RequestBody SheepGeneric sheepReq) {

        Sheep sheep = new Sheep(sheepReq, UUID.randomUUID().toString(), System.currentTimeMillis() / 1000L);

        animalRepository.save(sheep);

        String location = String.format("/animals/by_id/%s", sheep.get_id());
        return ResponseEntity.created(URI.create(location)).body(sheep);
    }

    public ResponseEntity<Chicken> create_animal(@RequestBody ChickenGeneric chickenReq) {

        Chicken chicken = new Chicken(chickenReq, UUID.randomUUID().toString(), System.currentTimeMillis() / 1000L);

        animalRepository.save(chicken);

        String location = String.format("/animals/by_id/%s", chicken.get_id());
        return ResponseEntity.created(URI.create(location)).body(chicken);
    }
}
