package cityfarm.api.db;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class ClassWriteConverter implements Converter<Class, String> {
    @Override
    public String convert(Class class_obj) {
        return class_obj.getName();
    }
}
