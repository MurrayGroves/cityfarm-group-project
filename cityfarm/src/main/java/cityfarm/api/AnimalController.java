package cityfarm.api;

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
    /**
     * @return a list of all animals in the DB
     */
    @GetMapping("/animals")
    public List<AnimalGeneric> get_animals() {
        // TODO - Actually get from DB
        Cow animal_1 = new Cow(UUID.randomUUID().toString(), "Alice", null, null, null, true, false);
        Cow animal_2 = new Cow(UUID.randomUUID().toString(), "Bob", null, null, null, true, true);

        List<AnimalGeneric> animals = new ArrayList<>();
        animals.add(animal_1);
        animals.add(animal_2);
        return animals;
    }

    /**
     * @param id ID of the animal you want to retrieve
     * @return object of the specified animal
     */
    @GetMapping("/animals/{id}")
    public ResponseEntity<AnimalGeneric> get_animal_by_id(@PathVariable int id) {
        // TODO - Actually get from DB, instead of generating
        if (id == 1) {
            // Return the Animal in a 200 OK response
            return ResponseEntity.ok().body(
                    new Cow(UUID.randomUUID().toString(), "Alice", null, null, null, true, false)
            );
        }

        if (id == 2) {
            // Return the Animal in a 200 OK response
            return ResponseEntity.ok().body(
                    new Cow(UUID.randomUUID().toString(), "Bob", null, null, null, true, true)
            );
        }

        throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Animal Not Found");
    }


    /**
     * Create new animal in app
     * @param cowReq request JSON must be in the format of a {@link CowGeneric CowGeneric} ({@link Cow Cow} but without ID and created timestamp)
     * @return the created `Cow` object
     */
    @PostMapping("/animals/create")
    public ResponseEntity<Cow> create_animal(@RequestBody CowGeneric cowReq) {

        Cow cow = new Cow(cowReq, UUID.randomUUID().toString(), System.currentTimeMillis() / 1000L);
        // TODO - Create animal in DB

        String location = String.format("/animals/%s", cow.get_id());
        return ResponseEntity.created(URI.create(location)).body(cow);
    }
}
