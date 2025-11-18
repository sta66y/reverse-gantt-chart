package by.pirog.RecursiveGanttChart.exception;

public class ProjectNotFound extends RuntimeException {
    public ProjectNotFound(String message) {
        super(message);
    }
}
