package cityfarm.api.enclosure;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
public class EnclosureController {
    @Autowired
    EnclosureRepository enclosureRepository;

    @Autowired
    MongoTemplate mongoTemplate;

    @PostMapping("/api/enclosures/create")
    public ResponseEntity<Enclosure> create_animal(@RequestBody EnclosureGeneric enclosureReq) {

        Enclosure enclosure = new Enclosure(enclosureReq);

        enclosureRepository.save(enclosure);

        String location = String.format("/enclosures/by_id/%s", enclosure.get_id());
        return ResponseEntity.created(URI.create(location)).body(enclosure);
    }

    @GetMapping("/api/enclosures")
    public List<EnclosureGeneric> get_enclosures() {
        return enclosureRepository.findAll();
    }

    @GetMapping("/api/enclosures/by_id/{id}")
    public ResponseEntity<EnclosureGeneric> get_enclosure_by_id(@PathVariable String id) {
        EnclosureGeneric enclosure = enclosureRepository.findEnclosureById(id);

        if (enclosure == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().body(enclosure);
    }

    @GetMapping("/api/enclosures/by_name/{name}")
    public ResponseEntity<List<EnclosureGeneric>> get_enclosure_by_name(@PathVariable String name) {
        List<EnclosureGeneric> enclosure = enclosureRepository.findEnclosureByName(name);

        return ResponseEntity.ok().body(enclosure);
    }
}
