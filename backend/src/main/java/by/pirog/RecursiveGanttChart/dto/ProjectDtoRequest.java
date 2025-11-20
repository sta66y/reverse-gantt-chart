package by.pirog.RecursiveGanttChart.dto;

import java.time.LocalDate;

public record ProjectDtoRequest (
    String name,
    String description,
    LocalDate deadline
) { }
