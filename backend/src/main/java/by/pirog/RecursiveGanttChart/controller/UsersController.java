package by.pirog.RecursiveGanttChart.controller;

import by.pirog.RecursiveGanttChart.dto.UserDto;
import by.pirog.RecursiveGanttChart.service.UsersService;
import by.pirog.RecursiveGanttChart.storage.enums.UserRoles;
import by.pirog.RecursiveGanttChart.storage.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UsersController {

    private final UsersService userService;

    @PostMapping("/projects/{projectId}/users/{userId}/role/{role}")
    public void assignRoleToUser(
            @PathVariable Integer projectId,
            @PathVariable Integer userId,
            @PathVariable UserRoles role,
            @AuthenticationPrincipal User currentUser) {
        userService.assignRoleToUser(projectId, userId, role, currentUser);
    }
    //TODO создать юзер

    @GetMapping("/projects/{projectId}/users")
    public List<UserDto> getProjectUsers(
            @PathVariable Integer projectId,
            @AuthenticationPrincipal User currentUser) {
        return userService.getProjectUsers(projectId, currentUser);
    }

    @DeleteMapping("/projects/{projectId}/users/{userId}")
    public void removeUserFromProject(
            @PathVariable Integer projectId,
            @PathVariable Integer userId,
            @AuthenticationPrincipal User currentUser) { // Добавил currentUser
        userService.removeUserFromProject(projectId, userId, currentUser);
    }
}