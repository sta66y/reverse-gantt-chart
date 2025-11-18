package by.pirog.RecursiveGanttChart.controller;

import by.pirog.RecursiveGanttChart.dto.ProjectDtoRequest;
import by.pirog.RecursiveGanttChart.dto.ProjectDtoResponse;
import by.pirog.RecursiveGanttChart.service.ProjectsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/project")
@RequiredArgsConstructor
@Slf4j
public class ProjectController {

    private final ProjectsService projectsService;

    @GetMapping
    public List<ProjectDtoResponse> getProjects(
            @AuthenticationPrincipal UserDetails userDetails) {
        log.info("Получение всех проектов пользователя {}", userDetails.getUsername());
        return projectsService.getProjects(userDetails);
    }

    @PostMapping
    public ProjectDtoResponse createProject(
            @RequestBody ProjectDtoRequest dtoRequest,
            @AuthenticationPrincipal UserDetails userDetails) {
        log.info("Создание проекта для пользователя {}", userDetails.getUsername());
        return projectsService.createProject(dtoRequest, userDetails);
    }

    @GetMapping("{id}")
    public ProjectDtoResponse getProjectById(
            @PathVariable Integer id,
            @AuthenticationPrincipal UserDetails userDetails) {
        log.info("Получение проекта с id {} пользователя {}", id, userDetails.getUsername());
        return projectsService.getProjectById(id, userDetails);
    }

    @PatchMapping("{id}")
    public ProjectDtoResponse updateProject(
            @PathVariable Integer id,
            @RequestBody ProjectDtoRequest dtoRequest,
            @AuthenticationPrincipal UserDetails userDetails) {
        log.info("Обновление проекта {} пользователя {}", id, userDetails.getUsername());
        return projectsService.updateProject(id, dtoRequest, userDetails);
    }

    @DeleteMapping("{id}")
    public List<ProjectDtoResponse> deleteProjectById(
            @PathVariable Integer id,
            @AuthenticationPrincipal UserDetails userDetails) {
        log.info("Удаление проекта с id {} пользователя {}", id, userDetails.getUsername());
        return projectsService.deleteProjectById(id, userDetails);
    }

}
