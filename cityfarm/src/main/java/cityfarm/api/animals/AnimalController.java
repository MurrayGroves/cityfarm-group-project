package cityfarm.api.animals;

import cityfarm.api.enclosure.Enclosure;
import cityfarm.api.schemas.AnimalSchema;
import cityfarm.api.schemas.SchemaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.autoconfigure.observation.ObservationProperties;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
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
     * @param farm to filter animals by.
     * @return a list of all animals, filtered by farm.
     */
    @GetMapping("/api/animals")
    public ResponseEntity<List<AnimalCustom>> get_animals(@RequestParam("farm") @Nullable String farm) {
        List<AnimalCustom> animals = animalRepository.findAll();
        if (farm != null) {
            animals = animals
                    .stream()
                    .filter((animal) -> {
                        if (animal.farm == null) {
                            return false;
                        }
                        return animal.farm.equals(farm);
                    })
                    .toList();
        }

        return ResponseEntity.ok().body(animals);
    }

    /**
     * @param id ID of the animal you want to retrieve
     * @return object of the specified animal
     */
    @GetMapping("/api/animals/by_id/{id}")
    public ResponseEntity<AnimalCustom> get_animal_by_id(@PathVariable String id) {
        AnimalCustom animal = animalRepository.findAnimalById(id);

        if (animal == null) {
            return ResponseEntity.status(404).build();
        }

        return ResponseEntity.ok().body(animal);
    }

    @GetMapping("/api/animals/by_ids")
    public ResponseEntity<List<AnimalCustom>> get_animal_by_ids(@RequestParam List<String> ids) {
        List<AnimalCustom> animals = new ArrayList<>();
        for (String id : ids) {
            AnimalCustom enclosure = animalRepository.findAnimalById(id);
            animals.add(enclosure);
        }

        return ResponseEntity.ok().body(animals);
    }

    @GetMapping("/api/animals/by_father/{id}")
    public ResponseEntity<List<AnimalCustom>> get_animal_by_father(@PathVariable String id) {
        List<AnimalCustom> animal = animalRepository.findAnimalByFather(id);

        if (animal == null) {
            return ResponseEntity.status(404).build();
        }

        return ResponseEntity.ok().body(animal);
    }

    @GetMapping("/api/animals/by_mother/{id}")
    public ResponseEntity<List<AnimalCustom>> get_animal_by_mother(@PathVariable String id) {
        List<AnimalCustom> animal = animalRepository.findAnimalByMother(id);

        if (animal == null) {
            return ResponseEntity.status(404).build();
        }

        return ResponseEntity.ok().body(animal);
    }

    /**
     * Get list of animals with a specific name
     * @param name name of the animals to search for (fuzzy search)
     * @param farm name of the farm to filter animal list by
     * @return list of all animals with that name
     */
    @GetMapping("/api/animals/by_name/{name}")
    public ResponseEntity<List<AnimalCustom>> get_animals_by_name(@PathVariable String name, @RequestParam @Nullable String farm) {
        List<AnimalCustom> animals = animalRepositoryCustom.findAnimalByName(name);
        if (farm != null) {
            animals = animals
                    .stream()
                    .filter((animal) -> animal.farm.equals(farm))
                    .toList();
        }

        return ResponseEntity.ok().body(animals);
    }


    /**
     * Create new animal in app
     * @param animalReq request JSON must be in the format of a {@link AnimalCreateRequest AnimalCreateRequest}
     * @return the created `AnimalCustom` object
     */
    @PostMapping("/api/animals/create")
    public ResponseEntity<String> create_animal(@RequestBody AnimalCreateRequest animalReq) {
        AnimalSchema schema = schemaRepository.findSchemaByName(animalReq.type);

        if (schema == null) {
            return ResponseEntity.badRequest().body(String.format("No schema found for specified type: %s", animalReq.type));
        }

        AnimalCustom animal;
        try {
            animal = schema.new_animal(animalReq);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

        animalRepository.save(animal);

        String location = String.format("/api/animals/by_id/%s", animal.get_id());

        return ResponseEntity.created(URI.create(location)).body(animal.get_id());
    }

    @PatchMapping("/api/animals/by_id/{id}")
    public ResponseEntity<String> update_animal(@PathVariable String id, @RequestBody AnimalCreateRequest animalReq) {
        AnimalCustom animal = animalRepository.findAnimalById(id);

        if (animal == null) {
            return ResponseEntity.status(404).build();
        }

        animal.fields = animalReq.fields;
        animal.name = animalReq.name;
        animal.mother = animalReq.mother;
        animal.father = animalReq.father;
        animal.breed = animalReq.breed;
        animal.alive = animalReq.alive;
        animal.sex = animalReq.sex;
        animal.dateOfBirth = animalReq.dateOfBirth;
        animal.notes = animalReq.notes;
        animal.farm = animalReq.farm;

        animalRepository.save(animal);

        String location = String.format("/api/animals/by_id/%s", animal.get_id());
        return ResponseEntity.created(URI.create(location)).body(animal.get_id());
    }

    @DeleteMapping("/api/animals/by_id/{id}")
    public ResponseEntity<String> delete_animal(@PathVariable String id) {
        animalRepository.deleteById(id);

        return ResponseEntity.ok(id);
    }
}
