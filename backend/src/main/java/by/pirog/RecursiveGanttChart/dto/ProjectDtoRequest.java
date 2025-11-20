package by.pirog.RecursiveGanttChart.dto;

import java.time.LocalDate;

public record ProjectDtoRequest (
    String name, //TODO проверить на not null
    String description,
    LocalDate deadline //TODO проверить на not null
) { }
