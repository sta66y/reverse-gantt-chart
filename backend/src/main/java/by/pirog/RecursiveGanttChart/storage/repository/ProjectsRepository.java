package by.pirog.RecursiveGanttChart.storage.repository;

import by.pirog.RecursiveGanttChart.storage.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectsRepository extends JpaRepository<Project, Integer> { }
