package by.pirog.RecursiveGanttChart.dto;

import java.time.LocalDate;
import java.util.List;

public record ProjectDtoResponse(
    Integer id,
    String name,
    String description,
    LocalDate deadline,

    String creatorName,
    String subjectName,

    List<ProjectComponentDtoResponse> tasks
) { }
