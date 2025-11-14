package by.pirog.RecursiveGanttChart.storage.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("PLANNER")
@NoArgsConstructor
public class Planner extends Reviewer {
    public void addUserToProject() {}; //TODO
    public void getAllUsersFromProject() {}; //TODO
    public void removeUserFromProject() {}; //TODO
    public void createTask() {}; //TODO
}

