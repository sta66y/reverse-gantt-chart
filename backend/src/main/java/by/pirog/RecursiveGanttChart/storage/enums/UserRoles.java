package by.pirog.RecursiveGanttChart.storage.enums;

public enum UserRoles {
    VIEWER {
        @Override public boolean canEditProject() { return false; }
        @Override public boolean canCreateTasks() { return false; }
        @Override public boolean canReviewTasks() { return false; }
        @Override public boolean canWorkOnTasks() { return false; }
        @Override public boolean canAssignRoles() { return false; }
        @Override public boolean canManageUsers() { return false; }
    },
    STUDENT {
        @Override public boolean canEditProject() { return false; }
        @Override public boolean canCreateTasks() { return false; }
        @Override public boolean canReviewTasks() { return false; }
        @Override public boolean canWorkOnTasks() { return true; }
        @Override public boolean canAssignRoles() { return false; }
        @Override public boolean canManageUsers() { return false; }
    },
    REVIEWER {
        @Override public boolean canEditProject() { return false; }
        @Override public boolean canCreateTasks() { return false; }
        @Override public boolean canReviewTasks() { return true; }
        @Override public boolean canWorkOnTasks() { return true; }
        @Override public boolean canAssignRoles() { return false; }
        @Override public boolean canManageUsers() { return false; }
    },
    PLANNER {
        @Override public boolean canEditProject() { return false; }
        @Override public boolean canCreateTasks() { return true; }
        @Override public boolean canReviewTasks() { return true; }
        @Override public boolean canWorkOnTasks() { return true; }
        @Override public boolean canAssignRoles() { return false; }
        @Override public boolean canManageUsers() { return true; }
    },
    ADMIN {
        @Override public boolean canEditProject() { return true; }
        @Override public boolean canCreateTasks() { return true; }
        @Override public boolean canReviewTasks() { return true; }
        @Override public boolean canWorkOnTasks() { return true; }
        @Override public boolean canAssignRoles() { return true; }
        @Override public boolean canManageUsers() { return true; }
    };

    public abstract boolean canEditProject();
    public abstract boolean canCreateTasks();
    public abstract boolean canReviewTasks();
    public abstract boolean canWorkOnTasks();
    public abstract boolean canAssignRoles();
    public abstract boolean canManageUsers();
}