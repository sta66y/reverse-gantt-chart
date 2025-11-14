package by.pirog.RecursiveGanttChart.storage.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("ADMIN")
@NoArgsConstructor
public class Admin extends Planner {
    public void changeProjectName() {}; //TODO
    public void changeProjectDetails() {}; //TODO
}

