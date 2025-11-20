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

    @Enumerated(EnumType.STRING)
    private TaskStatus status = TaskStatus.PLANNED;

    @Enumerated(EnumType.STRING)
    private ReviewerTaskStatus reviewerTaskStatus = ReviewerTaskStatus.NONE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private ProjectComponent parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjectComponent> tasks = new ArrayList<>();

    @OneToMany(mappedBy = "projectComponent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "task_assignees",
            joinColumns = @JoinColumn(name = "task_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> assignees = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id")
    private User creator;

    public void addTask(ProjectComponent task) {
        tasks.add(task);
        task.setParent(this);
    }

    public void removeTask(ProjectComponent task) {
        tasks.remove(task);
        task.setParent(null);
    }

    public void addComment(Comment comment) {
        comments.add(comment);
        comment.setProjectComponent(this);
    }

    public void removeComment(Comment comment) {
        comments.remove(comment);
        comment.setProjectComponent(null);
    }

    public void addAssignee(User user) {
        assignees.add(user);
    }

    public void removeAssignee(User user) {
        assignees.remove(user);
    }
}