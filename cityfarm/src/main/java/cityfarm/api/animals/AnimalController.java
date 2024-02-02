package cityfarm.api.animals;

import cityfarm.api.schemas.AnimalSchema;
import cityfarm.api.schemas.SchemaRepository;
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
    SchemaRepository schemaRepository;

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
    @PostMapping("/api/animals/{schemaName}/create")
    public ResponseEntity<String> create_animal(@RequestBody AnimalCreateRequest animalReq, @PathVariable String schemaName) {
        AnimalSchema schema = schemaRepository.findSchemaByName(schemaName);

        AnimalCustom animal;
        try {
            animal = schema.new_animal(animalReq);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

        animalRepository.save(animal);

        String location = String.format("/api/animals/by_id/%s", animal.get_id());
        return ResponseEntity.created(URI.create(location)).build();
    }
}
