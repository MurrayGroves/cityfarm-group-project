package cityfarm.api.db;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.WritingConverter;

@WritingConverter
public class JsonNodeWriteConverter implements Converter<JsonNode, String> {
    @Override
    public String convert(JsonNode json) {
        return json.toString();
    }
}