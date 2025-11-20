package by.pirog.RecursiveGanttChart.controller;

import by.pirog.RecursiveGanttChart.dto.ProjectDtoRequest;
import by.pirog.RecursiveGanttChart.dto.ProjectDtoResponse;
import by.pirog.RecursiveGanttChart.storage.model.User;
import by.pirog.RecursiveGanttChart.service.ProjectsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/project")
@RequiredArgsConstructor
public class ProjectsController {

    private final ProjectsService projectsService;

    @GetMapping
    public List<ProjectDtoResponse> getProjects(@AuthenticationPrincipal User currentUser) {
        return projectsService.getProjects(currentUser);
    }

    @PostMapping
    public ProjectDtoResponse createProject(
            @RequestBody ProjectDtoRequest dtoRequest,
            @AuthenticationPrincipal User currentUser) {
        return projectsService.createProject(dtoRequest, currentUser);
    }

    @GetMapping("/{id}")
    public ProjectDtoResponse getProjectById(
            @PathVariable Integer id,
            @AuthenticationPrincipal User currentUser) {
        return projectsService.getProjectById(id);
    }

    @PatchMapping("/{id}")
    public ProjectDtoResponse updateProject(
            @PathVariable Integer id,
            @RequestBody ProjectDtoRequest dtoRequest,
            @AuthenticationPrincipal User currentUser) {
        return projectsService.updateProject(id, dtoRequest, currentUser);
    }

    @DeleteMapping("/{id}")
    public void deleteProjectById(
            @PathVariable Integer id,
            @AuthenticationPrincipal User currentUser) {
        projectsService.deleteProjectById(id, currentUser);
    }
}