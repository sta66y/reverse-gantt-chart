package by.pirog.RecursiveGanttChart.storage.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("VIEWER")
@NoArgsConstructor
public class Viewer extends UserRole {
    public void viewProjectDetails(){};//TODO
    public void viewProjectTasks(){};//TODO
    public void getUsersFromProject(){};//TODO
}
