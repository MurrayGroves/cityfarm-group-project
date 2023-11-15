package cityfarm.api.enclosure;

import cityfarm.api.AnimalRepository;
import cityfarm.api.Cow;
import cityfarm.api.CowGeneric;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

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
}
