package by.pirog.RecursiveGanttChart.dto;

import by.pirog.RecursiveGanttChart.storage.enums.ReviewerTaskStatus;
import by.pirog.RecursiveGanttChart.storage.enums.TaskStatus;

import java.time.LocalDate;
import java.util.List;

public record ProjectComponentDtoResponse (
        String title,
        String description,
        LocalDate deadline,
        TaskStatus taskStatus,
        ReviewerTaskStatus reviewerTaskStatus,

        List<ProjectComponentDtoResponse> tasks,
        Integer projectId,
        String projectName,
        List<CommentDtoResponse> comments
){ }
