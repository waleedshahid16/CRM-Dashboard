import { createSelector, createSlice } from "@reduxjs/toolkit";
import { tasksData } from "../../data/tasksData";

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: tasksData,
    searchTerm: "",
    filterStatus: "All",
    filterPriority: "All",
    filterCategory: "All",
  },
  reducers: {
    addTask: (state, action) => {
      const task = action.payload;
      const newTask = {
        id: state.tasks.length + 1,
        ...task,
        createdDate: new Date().toISOString().split("T")[0],
        completedDate:
          task.status === "Completed"
            ? new Date().toISOString().split("T")[0]
            : null,
      };
      state.tasks.push(newTask);
    },
    deleteTask: (state, action) => {
      const id = action.payload;
      state.tasks = state.tasks.filter((task) => task.id !== id);
    },
    updateTask: (state, action) => {
      const updateTask = action.payload;
      const index = state.tasks.findIndex((task) => task.id === updateTask.id);
      if (index !== -1) {
        state.tasks[index] = {
          ...state.tasks[index],
          ...updateTask,
          completedDate:
            updateTask.status === "Completed"
              ? state.tasks[index].completedDate ||
                new Date().toISOString().split("T")[0]
              : null,
        };
      }
    },
    toggleTaskStatus: (state, action) => {
      const id = action.payload;
      const task = state.tasks.find((task) => task.id === id);
      if (task) {
        if (task.status === "Completed") {
          task.status = "Active";
          task.completedDate = null;
        } else {
          task.status = "Completed";
          task.completedDate = new Date().toISOString().split("T")[0];
        }
      }
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setFilterStatus: (state, action) => {
      state.filterStatus = action.payload;
    },
    setFilterPriority: (state, action) => {
      state.filterPriority = action.payload;
    },
    setFilterCategory: (state, action) => {
      state.filterCategory = action.payload;
    },
  },
});

export const {
  addTask,
  deleteTask,
  updateTask,
  toggleTaskStatus,
  setSearchTerm,
  setFilterStatus,
  setFilterPriority,
  setFilterCategory,
} = tasksSlice.actions;

// Helper function to filter tasks
const filterTasks = (
  tasks,
  searchTerm,
  filterStatus,
  filterPriority,
  filterCategory
) => {
  return tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.responsiblePersons.some((person) =>
        person.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      task.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus =
      filterStatus === "All" || task.status === filterStatus;

    const matchesPriority =
      filterPriority === "All" || task.priority === filterPriority;

    const matchesCategory =
      filterCategory === "All" || task.category === filterCategory;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });
};

// Selectors with proper memoization
export const selectAllTasks = createSelector(
  [
    (state) => state.tasks.tasks,
    (state) => state.tasks.searchTerm,
    (state) => state.tasks.filterStatus,
    (state) => state.tasks.filterPriority,
    (state) => state.tasks.filterCategory,
  ],
  filterTasks
);

// Separate selectors for each status
export const selectActiveTasks = createSelector(
  [
    (state) => state.tasks.tasks,
    (state) => state.tasks.searchTerm,
    (state) => state.tasks.filterPriority,
    (state) => state.tasks.filterCategory,
  ],
  (tasks, searchTerm, filterPriority, filterCategory) => {
    return filterTasks(
      tasks,
      searchTerm,
      "Active",
      filterPriority,
      filterCategory
    );
  }
);

export const selectOnHoldTasks = createSelector(
  [
    (state) => state.tasks.tasks,
    (state) => state.tasks.searchTerm,
    (state) => state.tasks.filterPriority,
    (state) => state.tasks.filterCategory,
  ],
  (tasks, searchTerm, filterPriority, filterCategory) => {
    return filterTasks(
      tasks,
      searchTerm,
      "On Hold",
      filterPriority,
      filterCategory
    );
  }
);

export const selectCompletedTasksList = createSelector(
  [
    (state) => state.tasks.tasks,
    (state) => state.tasks.searchTerm,
    (state) => state.tasks.filterPriority,
    (state) => state.tasks.filterCategory,
  ],
  (tasks, searchTerm, filterPriority, filterCategory) => {
    return filterTasks(
      tasks,
      searchTerm,
      "Completed",
      filterPriority,
      filterCategory
    );
  }
);

export const selectCancelledTasks = createSelector(
  [
    (state) => state.tasks.tasks,
    (state) => state.tasks.searchTerm,
    (state) => state.tasks.filterPriority,
    (state) => state.tasks.filterCategory,
  ],
  (tasks, searchTerm, filterPriority, filterCategory) => {
    return filterTasks(
      tasks,
      searchTerm,
      "Cancelled",
      filterPriority,
      filterCategory
    );
  }
);

export const selectSearchTerm = (state) => state.tasks.searchTerm;
export const selectFilterStatus = (state) => state.tasks.filterStatus;
export const selectFilterPriority = (state) => state.tasks.filterPriority;
export const selectFilterCategory = (state) => state.tasks.filterCategory;

export const selectTotalTasks = createSelector(
  [(state) => state.tasks.tasks],
  (tasks) => ({ total: tasks.length })
);

export const selectActiveTasksCount = createSelector(
  [(state) => state.tasks.tasks],
  (tasks) => ({
    active: tasks.filter((t) => t.status === "Active").length,
  })
);

export const selectCompletedTasks = createSelector(
  [(state) => state.tasks.tasks],
  (tasks) => ({
    completed: tasks.filter((t) => t.status === "Completed").length,
  })
);

export const selectHighPriorityTasks = createSelector(
  [(state) => state.tasks.tasks],
  (tasks) => ({
    high: tasks.filter(
      (t) =>
        (t.priority === "High" || t.priority === "Urgent") &&
        t.status !== "Completed"
    ).length,
  })
);

export default tasksSlice.reducer;
