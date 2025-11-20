package by.pirog.RecursiveGanttChart.service;

import by.pirog.RecursiveGanttChart.dto.UserDto;
import by.pirog.RecursiveGanttChart.exception.ProjectNotFound;
import by.pirog.RecursiveGanttChart.exception.UserNotFound;
import by.pirog.RecursiveGanttChart.mapper.UserMapper;
import by.pirog.RecursiveGanttChart.storage.enums.UserRoles;
import by.pirog.RecursiveGanttChart.storage.model.Project;
import by.pirog.RecursiveGanttChart.storage.model.ProjectComponent;
import by.pirog.RecursiveGanttChart.storage.model.User;
import by.pirog.RecursiveGanttChart.storage.model.UserRole;
import by.pirog.RecursiveGanttChart.storage.repository.ProjectsRepository;
import by.pirog.RecursiveGanttChart.storage.repository.UserRolesRepository;
import by.pirog.RecursiveGanttChart.storage.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsersService {

    private final UsersRepository usersRepository;
    private final UserRolesRepository userRolesRepository;
    private final ProjectsRepository projectsRepository;

    /**
     * Назначение роли пользователю в проекте
     */
    @Transactional
    public void assignRoleToUser(User user, Project project, UserRoles role) {
        // Удаляем существующую роль пользователя в этом проекте
        removeUserRoleFromProject(user, project);

        // Создаем новую роль
        UserRole userRole = new UserRole(user, project, role);
        userRolesRepository.save(userRole);
    }

    /**
     * Назначение роли пользователю по ID
     */
    @Transactional
    public void assignRoleToUser(Integer projectId, Integer userId, UserRoles role, User currentUser) {
        Project project = projectsRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFound("Project not found with id: " + projectId));

        User targetUser = getUserById(userId); //TODO проверить что юзер есть

        // Проверяем, что текущий пользователь имеет права администратора
        if (!hasAdminAccess(currentUser, project)) {
            throw new SecurityException("Only admin can assign roles");
        }

        assignRoleToUser(targetUser, project, role);
    }

    /**
     * Удаление пользователя из проекта
     */
    @Transactional
    public void removeUserFromProject(Integer projectId, Integer userId, User currentUser) {
        Project project = projectsRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFound("Project not found with id: " + projectId));

        User targetUser = getUserById(userId);

        // Проверяем, что текущий пользователь имеет права администратора
        if (!hasAdminAccess(currentUser, project)) {
            throw new SecurityException("Only admin can remove users from project");
        }

        removeUserRoleFromProject(targetUser, project);
    }

    /**
     * Удаление роли пользователя из проекта
     */
    @Transactional
    public void removeUserRoleFromProject(User user, Project project) {
        Optional<UserRole> existingRole = userRolesRepository.findByUserAndProject(user, project);
        existingRole.ifPresent(userRolesRepository::delete);
    }

    /**
     * Проверка прав администратора
     */
    public boolean hasAdminAccess(User user, Project project) {
        return userRolesRepository.findByUserAndProject(user, project)
                .map(role -> role.getRoleType().canEditProject())
                .orElse(false);
    }

    /**
     * Проверка прав на создание задач
     */
    public boolean canCreateTasks(User user, Project project) {
        return userRolesRepository.findByUserAndProject(user, project)
                .map(role -> role.getRoleType().canCreateTasks())
                .orElse(false);
    }

    /**
     * Проверка прав на ревью задач
     */
    public boolean canReviewTasks(User user, Project project) {
        return userRolesRepository.findByUserAndProject(user, project)
                .map(role -> role.getRoleType().canReviewTasks())
                .orElse(false);
    }

    /**
     * Проверка прав на работу с задачами
     */
    public boolean canWorkOnTasks(User user, Project project) {
        return userRolesRepository.findByUserAndProject(user, project)
                .map(role -> role.getRoleType().canWorkOnTasks())
                .orElse(false);
    }

    /**
     * Проверка возможности назначения ролей
     */
    public boolean canAssignRoles(User user, Project project) {
        return userRolesRepository.findByUserAndProject(user, project)
                .map(role -> role.getRoleType().canAssignRoles())
                .orElse(false);
    }

    /**
     * Проверка возможности управления пользователями
     */
    public boolean canManageUsers(User user, Project project) {
        return userRolesRepository.findByUserAndProject(user, project)
                .map(role -> role.getRoleType().canManageUsers())
                .orElse(false);
    }

    /**
     * Проверка доступа к проекту (любая роль)
     */
    public boolean hasProjectAccess(User user, Project project) {
        return userRolesRepository.existsByUserAndProject(user, project);
    }

    /**
     * Проверка возможности работы с конкретной задачей
     */
    public boolean canWorkOnTask(User user, ProjectComponent task) {
        // Может работать, если назначен на задачу или имеет права выше студента
        boolean isAssignee = task.getAssignees().contains(user);
        boolean hasHigherRights = canCreateTasks(user, task.getProject()) ||
                canReviewTasks(user, task.getProject()) ||
                hasAdminAccess(user, task.getProject());

        return isAssignee || hasHigherRights;
    }

    /**
     * Получение пользователей по списку ID
     */
    public List<User> getUsersByIds(List<Integer> userIds) {
        return usersRepository.findAllById(userIds);
    }

    /**
     * Получение всех пользователей проекта
     */
    public List<UserDto> getProjectUsers(Integer projectId, User currentUser) {
        Project project = projectsRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFound("Project not found with id: " + projectId));

        // Проверка прав доступа
        if (!hasProjectAccess(currentUser, project)) {
            throw new SecurityException("No access to project");
        }

        List<User> users = userRolesRepository.findUsersByProject(project);
        return users.stream()
                .map(UserMapper::toDto)
                .toList();
    }

    /**
     * Получение роли пользователя в проекте
     */
    public Optional<UserRoles> getUserRoleInProject(User user, Project project) {
        return userRolesRepository.findByUserAndProject(user, project)
                .map(UserRole::getRoleType);
    }

    /**
     * Получение пользователя по ID
     */
    public User getUserById(Integer userId) {
        return usersRepository.findById(userId)
                .orElseThrow(() -> new UserNotFound("User not found with id: " + userId));
    }

    /**
     * Получение объекта UserRole для пользователя в проекте
     */
    public Optional<UserRole> getUserRoleEntity(User user, Project project) {
        return userRolesRepository.findByUserAndProject(user, project);
    }
}