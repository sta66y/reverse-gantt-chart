package by.pirog.RecursiveGanttChart.dto;

import java.time.LocalDate;

public record ProjectComponentDtoRequest(
        String title,
        String description,
        LocalDate deadline,
        Integer projectId,
        Integer parentTaskId
) { }