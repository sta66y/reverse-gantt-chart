package by.pirog.RecursiveGanttChart.storage.repository;

import by.pirog.RecursiveGanttChart.storage.model.Project;
import by.pirog.RecursiveGanttChart.storage.model.User;
import by.pirog.RecursiveGanttChart.storage.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRolesRepository extends JpaRepository<UserRole, Long> {

    Optional<UserRole> findByUserAndProject(User user, Project project);

    boolean existsByUserAndProject(User user, Project project);

    @Query("SELECT ur.user FROM UserRole ur WHERE ur.project = :project")
    List<User> findUsersByProject(@Param("project") Project project);

}