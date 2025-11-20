package by.pirog.RecursiveGanttChart.util;

import org.springframework.stereotype.Component;

import java.util.function.Consumer;

@Component
public class EntityUpdater {

    public <T> void updateIfNotNull(T target, T source, Consumer<T> setter) {
        if (source != null) {
            setter.accept(source);
        }
    }

    public void updateIfNotBlank(String target, String source, Consumer<String> setter) {
        if (source != null && !source.isBlank()) {
            setter.accept(source);
        }
    }
}