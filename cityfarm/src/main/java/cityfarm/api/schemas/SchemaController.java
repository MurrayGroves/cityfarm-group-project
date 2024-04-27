package cityfarm.api.schemas;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://cityfarm.murraygrov.es"}, methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.PATCH})
public class SchemaController {
    @Autowired
    SchemaRepository schemaRepository;


    @Autowired
    SchemaRepositoryCustom schemaRepositoryCustom;
  
    @PostMapping("/api/schemas/create")
    public ResponseEntity<AnimalSchema> create_schema(@RequestBody AnimalSchema schema) {
        schemaRepository.save(schema);

        String location = String.format("/api/schemas/by_name/%s", schema.get_name());
        return ResponseEntity.created(URI.create(location)).body(schema);
    }

    @GetMapping("/api/schemas")
    public ResponseEntity<List<AnimalSchema>> get_schemas() {
        return ResponseEntity.ok().body(
                schemaRepository.findAll()
                .stream()
                .filter(s -> !s.get_hidden())
                .toList()
        );
    }

    @GetMapping("/api/schemas/by_name/{name}")
    public ResponseEntity<AnimalSchema> by_name(@PathVariable String name) {
        AnimalSchema schema = schemaRepository.findSchemaByName(name);

        if (schema.get_hidden()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().body(schema);
    }

    @DeleteMapping("/api/schemas/delete/{name}")
    public ResponseEntity<String> delete(@PathVariable String name) {
        schemaRepository.deleteByName(name);

        return ResponseEntity.ok(name);
    }

    @PatchMapping("/api/schemas/by_name/{name}/hidden")
    public ResponseEntity<Boolean> set_hidden(@PathVariable String name, @RequestBody JsonNode hiddenReq) {
        Boolean hidden = hiddenReq.get("hidden").asBoolean();
        AnimalSchema schema = schemaRepository.findSchemaByName(name);
        schema.set_hidden(hidden);
        schemaRepository.save(schema);

        return ResponseEntity.ok(hidden);
    }
}
