package by.pirog.RecursiveGanttChart.service;

import by.pirog.RecursiveGanttChart.dto.ProjectDtoRequest;
import by.pirog.RecursiveGanttChart.dto.ProjectDtoResponse;
import by.pirog.RecursiveGanttChart.exception.ProjectNotFound;
import by.pirog.RecursiveGanttChart.mapper.ProjectMapper;
import by.pirog.RecursiveGanttChart.storage.enums.UserRoles;
import by.pirog.RecursiveGanttChart.storage.model.Project;
import by.pirog.RecursiveGanttChart.storage.model.User;
import by.pirog.RecursiveGanttChart.storage.repository.ProjectsRepository;
import by.pirog.RecursiveGanttChart.util.EntityUpdater;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectsService {

    private final ProjectsRepository projectsRepository;
    private final UsersService usersService;
    private final EntityUpdater entityUpdater;

    public List<ProjectDtoResponse> getProjects(User currentUser) {
        return projectsRepository.findAll().stream()
                .filter(project -> usersService.hasProjectAccess(currentUser, project))
                .map(ProjectMapper::toDto)
                .toList();
    }

    @Transactional
    public ProjectDtoResponse createProject(ProjectDtoRequest dtoRequest, User currentUser) {
        Project project = ProjectMapper.toEntity(dtoRequest, currentUser);

        Project savedProject = projectsRepository.save(project);

        // назначаем создателю роль ADMIN
        usersService.assignRoleToUser(currentUser, savedProject, UserRoles.ADMIN);

        return ProjectMapper.toDto(savedProject);
    }

    public ProjectDtoResponse getProjectById(Integer id) {
        Project project = projectsRepository.findById(id)
                .orElseThrow(() -> new ProjectNotFound("Проект с id: " + id + " не найден."));
        return ProjectMapper.toDto(project);
    }

    @Transactional
    public ProjectDtoResponse updateProject(Integer id, ProjectDtoRequest dtoRequest, User currentUser) {
        Project project = projectsRepository.findById(id)
                .orElseThrow(() -> new ProjectNotFound("Проект с id: " + id + " не найден."));

        if (!usersService.hasAdminAccess(currentUser, project)) {
            throw new SecurityException("Нет разрешения к редактированию проекта");
        }

        entityUpdater.updateIfNotBlank(project.getName(), dtoRequest.name(), project::setName);
        entityUpdater.updateIfNotBlank(project.getDescription(), dtoRequest.description(), project::setDescription);
        entityUpdater.updateIfNotNull(project.getDeadline(), dtoRequest.deadline(), project::setDeadline);

        return ProjectMapper.toDto(projectsRepository.save(project));
    }
    @Transactional
    public void deleteProjectById(Integer id, User currentUser) {
        Project project = projectsRepository.findById(id)
                .orElseThrow(() -> new ProjectNotFound("Проект с id: " + id + " не найден."));

        if (!usersService.hasAdminAccess(currentUser, project)) {
            throw new SecurityException("Нет разрешения к редактированию проекта");
        }

        projectsRepository.delete(project);
    }
}