package by.pirog.RecursiveGanttChart.mapper;

import by.pirog.RecursiveGanttChart.dto.ProjectDtoRequest;
import by.pirog.RecursiveGanttChart.dto.ProjectDtoResponse;
import by.pirog.RecursiveGanttChart.storage.model.Project;
import by.pirog.RecursiveGanttChart.storage.model.User;

public class ProjectMapper {
    public static ProjectDtoResponse toDto(Project project) {
        return new ProjectDtoResponse(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getDeadline(),
                project.getCreator().getEmail(),
                project.getProjectComponents().stream().map(ProjectComponentMapper::toDto).toList()
        );
    }

    public static Project toEntity(ProjectDtoRequest dtoRequest, User creator) {
        return new Project().builder()
                .name(dtoRequest.name())
                .description(dtoRequest.description())
                .deadline(dtoRequest.deadline())
                .creator(creator)
                .build();
    }
}
