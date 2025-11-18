package by.pirog.RecursiveGanttChart.dto;

import java.time.LocalDate;

public record ProjectDtoRequest (
    Integer id,
    String name,
    String description,
    LocalDate deadline
) { }
