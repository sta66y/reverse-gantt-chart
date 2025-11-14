package by.pirog.RecursiveGanttChart.storage.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "comments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String textField;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User author; //TODO тут отличается от диаграммы

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_component_id")
    private ProjectComponent projectComponent;
}
