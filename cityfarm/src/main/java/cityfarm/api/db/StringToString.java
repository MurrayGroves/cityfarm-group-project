package cityfarm.api.db;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.Date;

@Component
public class StringToString implements Converter<String, String> {
    @Override
    public String convert(String myString) {
        return myString;
    }
}