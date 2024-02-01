package cityfarm.api.schemas;

import cityfarm.api.animals.AnimalGeneric;
import cityfarm.api.animals.AnimalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

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

    @GetMapping("/api/schemas")
    public ResponseEntity<List<AnimalSchema>> get_schemas() {
        return ResponseEntity.ok().body(schemaRepository.findAll());
    }

    @GetMapping("/api/schemas/by_name/{name}")
    public ResponseEntity<AnimalSchema> by_name(@PathVariable String name) {
        AnimalSchema schema = schemaRepository.findSchemaByName(name);

        if (schema == null) {
            return ResponseEntity.status(404).build();
        }

        return ResponseEntity.ok().body(schema);
    }
}