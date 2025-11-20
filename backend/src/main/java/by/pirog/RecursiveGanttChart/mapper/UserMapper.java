package by.pirog.RecursiveGanttChart.mapper;

import by.pirog.RecursiveGanttChart.dto.UserDto;
import by.pirog.RecursiveGanttChart.storage.model.User;

public class UserMapper {
    public static UserDto toDto(User user) {
        return new UserDto(
                user.getUserId(),
                user.getEmail(),
                user.getProjects().stream().map(ProjectMapper::toDto).toList()
        );
    }
}
