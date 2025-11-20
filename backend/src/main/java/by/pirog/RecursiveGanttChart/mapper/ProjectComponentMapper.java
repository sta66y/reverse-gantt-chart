package by.pirog.RecursiveGanttChart.mapper;

import by.pirog.RecursiveGanttChart.dto.ProjectComponentDtoResponse;
import by.pirog.RecursiveGanttChart.storage.model.ProjectComponent;
import org.springframework.stereotype.Component;

@Component
public class ProjectComponentMapper {
    public static ProjectComponentDtoResponse toDto(ProjectComponent component) {
        return new ProjectComponentDtoResponse(
                component.getTitle(),
                component.getDescription(),
                component.getDeadline(),
                component.getStatus(),
                component.getReviewerTaskStatus(),
                component.getTasks().stream().map(ProjectComponentMapper::toDto).toList(),
                component.getProject().getId(),
                component.getProject().getName(),
                null //TODO
        );
    }

}
