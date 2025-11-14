package by.pirog.RecursiveGanttChart.storage.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@DiscriminatorValue("STUDENT")
@NoArgsConstructor
public class Student extends Viewer {
    public void leaveComment() {}; //TODO
    public void deleteComment() {};//TODO
    public void changeTaskStatus() {};//TODO
    public void getAllUserTasks() {};//TODO
}

