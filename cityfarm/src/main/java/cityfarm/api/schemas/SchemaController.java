package cityfarm.api.schemas;

import cityfarm.api.animals.AnimalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://cityfarm.murraygrov.es"}, methods = {RequestMethod.GET, RequestMethod.POST})
public class SchemaController {
    @Autowired
    SchemaRepository schemaRepository;

    @PostMapping("/api/schemas/create")
    public ResponseEntity<AnimalSchema> create_schema(@RequestBody AnimalSchema schema) {
        schemaRepository.save(schema);

        String location = String.format("/api/schemas/by_name/%s", schema.get_name());
        return ResponseEntity.created(URI.create(location)).body(schema);
    }
}