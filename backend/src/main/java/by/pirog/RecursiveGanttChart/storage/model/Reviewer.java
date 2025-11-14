package by.pirog.RecursiveGanttChart.storage.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("REVIEWER")
@NoArgsConstructor
public class Reviewer extends Student {

    public void reviewTask() {}; //TODO
}

