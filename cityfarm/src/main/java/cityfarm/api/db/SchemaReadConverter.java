package cityfarm.api.db;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.convert.ReadingConverter;

import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.type.TypeFactory;
import com.fasterxml.jackson.databind.util.Converter;

import cityfarm.api.schemas.AnimalSchema;
import cityfarm.api.schemas.SchemaRepository;

@ReadingConverter
public class SchemaReadConverter implements Converter<String, AnimalSchema> {
    private final SchemaRepository schemaRepository;

    public SchemaReadConverter (SchemaRepository schemaRepository) {
        this.schemaRepository = schemaRepository;
    }

    @Override
    public AnimalSchema convert(String name) {
        return schemaRepository.findSchemaByName(name);
    }

    @Override
    public JavaType getInputType(TypeFactory arg0) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getInputType'");
    }

    @Override
    public JavaType getOutputType(TypeFactory arg0) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getOutputType'");
    }
}