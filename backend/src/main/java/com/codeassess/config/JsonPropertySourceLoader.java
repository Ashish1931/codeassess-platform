package com.codeassess.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.env.PropertySourceLoader;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.PropertySource;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.util.*;

public class JsonPropertySourceLoader implements PropertySourceLoader {

    @Override
    public String[] getFileExtensions() {
        return new String[]{"json"};
    }

    @Override
    public List<PropertySource<?>> load(String name, Resource resource) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        @SuppressWarnings("unchecked")
        Map<String, Object> map = mapper.readValue(resource.getInputStream(), Map.class);
        Map<String, Object> result = new LinkedHashMap<>();
        buildFlattenedMap(result, map, "");
        return Collections.singletonList(new MapPropertySource(name, result));
    }

    private void buildFlattenedMap(Map<String, Object> result, Map<String, Object> source, String path) {
        for (Map.Entry<String, Object> entry : source.entrySet()) {
            String key = path.isEmpty() ? entry.getKey() : path + "." + entry.getKey();
            if (entry.getValue() instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> subMap = (Map<String, Object>) entry.getValue();
                buildFlattenedMap(result, subMap, key);
            } else {
                result.put(key, entry.getValue());
            }
        }
    }
}
