package by.pirog.RecursiveGanttChart.storage.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String description;
    private LocalDate deadline;

    @ManyToOne
    @JoinColumn(name = "creator_user_id")
    private User creator;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjectComponent> projectComponents = new ArrayList<>();

    public void addProjectComponent(ProjectComponent projectComponent) {
        projectComponents.add(projectComponent);
        projectComponent.setProject(this);
    }

    public void removeProjectComponent(ProjectComponent projectComponent) {
        projectComponents.remove(projectComponent);
        projectComponent.setProject(null);
    }
}
