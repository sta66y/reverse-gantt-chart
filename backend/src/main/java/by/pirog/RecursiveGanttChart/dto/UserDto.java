package by.pirog.RecursiveGanttChart.dto;

import java.util.List;

public record UserDto (
    Integer userId,
    String email,
    List<ProjectDtoResponse> projects
){ }
