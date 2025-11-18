package by.pirog.RecursiveGanttChart.storage.model;

import by.pirog.RecursiveGanttChart.storage.enums.ReviewerTaskStatus;
import by.pirog.RecursiveGanttChart.storage.enums.TaskStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "project_components")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProjectComponent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String title;
    private String description;
    private LocalDate deadline;
    private TaskStatus status;
    private ReviewerTaskStatus reviewerTaskStatus;

    private List<ProjectComponent> tasks = new ArrayList<>(); //TODO чекни


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @OneToMany(mappedBy = "projectComponent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    public void addComment(Comment comment) {
        comments.add(comment);
        comment.setProjectComponent(this);
    }

    public void removeProjectComponent(Comment comment) {
        comments.remove(comment);
        comment.setProjectComponent(null);
    }

    //TODO private UserRole userMakesTask это как

}
