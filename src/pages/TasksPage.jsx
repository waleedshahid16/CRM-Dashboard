/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/static-components */
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CheckSquare,
  Square,
  User,
  Calendar,
  Tag,
  Edit2,
  Trash2,
  Search,
  Plus,
  CheckCircle2,
  Circle,
  ListTodo,
  XCircle,
  PauseCircle,
  AlertTriangle,
} from "lucide-react";

import {
  selectActiveTasks,
  selectOnHoldTasks,
  selectCompletedTasksList,
  selectCancelledTasks,
  selectSearchTerm,
  selectFilterPriority,
  selectFilterCategory,
  setSearchTerm,
  setFilterPriority,
  setFilterCategory,
  deleteTask,
  toggleTaskStatus,
} from "../store/slices/tasksSlice";

import { taskPriorities, taskCategories } from "../data/tasksData";
import { taskPriorityColors } from "../constants/colorClasses";

import AddTaskModal from "../components/modals/AddTaskModal";
import { useNavigate } from "react-router-dom";

// Delete Confirmation Dialog Component
const DeleteConfirmDialog = ({ isOpen, onClose, onConfirm, taskTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#f8faf9] rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-red-50 p-6 border-b border-red-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#2f362f]">Delete Task</h3>
              <p className="text-sm text-[#2f362f] mt-1">
                This action cannot be undone
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-[#2f362f] leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-bold text-[#2f362f]">"{taskTitle}"</span>?
          </p>
          <p className="text-sm text-[#2f362f] mt-3 bg-[#FEFDFC] p-3 rounded-lg border border-[#BCC8BC]">
            ⚠️ This will permanently remove the task from your list.
          </p>
        </div>

        {/* Footer */}
        <div className="bg-[#FEFDFC] px-6 py-4 flex gap-3 justify-end border-t border-[#BCC8BC]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border-2 border-[#BCC8BC] text-[#2f362f] rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 bg-red-600 text-[#2f362f] rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-red-500/30"
          >
            <Trash2 className="w-4 h-4" />
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
};

const TasksPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Selectors
  const activeTasks = useSelector(selectActiveTasks);
  const onHoldTasks = useSelector(selectOnHoldTasks);
  const completedTasks = useSelector(selectCompletedTasksList);
  const cancelledTasks = useSelector(selectCancelledTasks);

  const searchTerm = useSelector(selectSearchTerm);
  const filterPriority = useSelector(selectFilterPriority);
  const filterCategory = useSelector(selectFilterCategory);

  // Modals
  const [taskEditModal, setTaskEditModal] = useState({
    open: false,
    data: null,
  });

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    taskId: null,
    taskTitle: "",
  });

  // Handlers
  const handleDeleteClick = (task, event) => {
    event.stopPropagation();
    setDeleteDialog({
      open: true,
      taskId: task.id,
      taskTitle: task.title,
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.taskId != null) {
      dispatch(deleteTask(deleteDialog.taskId));
    }
    setDeleteDialog({ open: false, taskId: null, taskTitle: "" });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, taskId: null, taskTitle: "" });
  };

  const handleToggleStatus = (id, event) => {
    event.stopPropagation();
    dispatch(toggleTaskStatus(id));
  };

  const openTaskEdit = (data = null, event = null) => {
    if (event) event.stopPropagation();
    setTaskEditModal({ open: true, data });
  };

  const closeTaskEdit = () => setTaskEditModal({ open: false, data: null });

  // Task Card
  const TaskCard = ({ task }) => {
    const priorityColor = taskPriorityColors[task.priority];
    const isCompleted = task.status === "Completed";
    const isCancelled = task.status === "Cancelled";

    return (
      <div
        className={`bg-[#FEFDFC] rounded-lg p-4 shadow-sm border border-[#BCC8BC] hover:shadow-md transition-all duration-300 mb-3 ${
          isCompleted || isCancelled ? "opacity-75" : ""
        } cursor-pointer`}
        onClick={(e) => openTaskEdit(task, e)}
      >
        {/* Checkbox + Title */}
        <div className="flex items-start gap-3 mb-3">
          <button
            onClick={(e) => handleToggleStatus(task.id, e)}
            className="shrink-0 mt-0.5"
          >
            {isCompleted ? (
              <CheckSquare className="w-5 h-5 text-green-600" />
            ) : (
              <Square className="w-5 h-5 text-[#2f362f] hover:text-blue-600" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h4
              className={`text-sm font-bold text-[#2f362f] ${
                isCompleted || isCancelled ? "line-through" : ""
              }`}
            >
              {task.title}
            </h4>
            <p className="text-xs text-[#2f362f] mt-1 line-clamp-2">
              {task.description}
            </p>
          </div>
        </div>

        {/* Priority + Status */}
        <div className="mb-3 flex flex-wrap gap-2">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${priorityColor.bg} ${priorityColor.text}`}
          >
            <span
              className={`inline-block w-1.5 h-1.5 rounded-md mr-1.5 ${priorityColor.dot}`}
            ></span>
            {task.priority}
          </span>

          {task.status !== "Active" && (
            <span
              className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${
                task.status === "Completed"
                  ? "bg-green-100 text-green-700"
                  : task.status === "On Hold"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {task.status}
            </span>
          )}
        </div>

        {/* Person + Date + Category */}
        <div className="space-y-1.5 mb-3 text-xs">
          <div className="flex items-center gap-2 text-[#2f362f]">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">
              {task.responsiblePersons?.slice(0, 2).join(", ")}
              {task.responsiblePersons?.length > 2 &&
                ` +${task.responsiblePersons.length - 2}`}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[#2f362f]">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {task.startDate} → {task.dueDate}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[#2f362f]">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <span>{task.category}</span>
          </div>
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-slate-100 text-[#2f362f] rounded text-xs"
              >
                {tag}
              </span>
            ))}

            {task.tags.length > 3 && (
              <span className="px-2 py-0.5 bg-slate-100 text-[#2f362f] rounded text-xs">
                +{task.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-1 pt-2 border-t border-[#BCC8BC]">
          <button
            className="flex-1 px-1.5 py-1 bg-slate-100 text-[#2f362f] rounded-lg hover:bg-slate-200 transition-colors text-xs font-medium flex items-center justify-center gap-1"
            onClick={(e) => openTaskEdit(task, e)}
          >
            <Edit2 className="w-3 h-3" />
            <span>Edit</span>
          </button>

          <button
            onClick={(e) => handleDeleteClick(task, e)}
            className="px-1.5 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  };

  // Column Component
  const TaskColumn = ({ title, tasks, icon: Icon, color }) => {
    const colorClasses = {
      blue: "bg-blue-50 text-blue-700 border-blue-200",
      yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
      green: "bg-green-50 text-green-700 border-green-200",
      red: "bg-red-50 text-red-700 border-red-200",
    };

    return (
      <div className="w-full">
        <div className={`${colorClasses[color]} rounded-md p-4 border-2 mb-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="w-5 h-5" />
              <h3 className="font-bold text-sm">{title}</h3>
            </div>

            <span className="px-2.5 py-1 bg-white rounded-full text-xs font-bold">
              {tasks.length}
            </span>
          </div>
        </div>

        <div className="space-y-0">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-[#2f362f]">
              <Circle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No tasks</p>
            </div>
          ) : (
            tasks.map((task) => <TaskCard key={task.id} task={task} />)
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 lg:p-8 max-w-full mx-auto overflow-hidden">
      {/* Header */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-[#2f362f] mb-2 sm:mb-3">
          <button
            onClick={() => navigate("/")}
            className="hover:text-[#2f362f]/60 transition-colors"
          >
            Dashboard
          </button>
          <span>/</span>
          <span className="text-[#2f362f] font-medium">Tasks</span>
        </div>

        <div className="flex flex-col gap-4">
          {/* Title */}
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2f362f] mb-1 sm:mb-2 tracking-tight">
              Task Board
            </h1>

            <p className="text-[#2f362f] text-sm sm:text-base lg:text-lg">
              {activeTasks.length +
                onHoldTasks.length +
                completedTasks.length +
                cancelledTasks.length}{" "}
              total tasks
            </p>
          </div>

          {/* Filters - Stack on mobile, row on tablet+ */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 sm:gap-3">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#2f362f] cursor-pointer" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                className="pl-9 sm:pl-10 pr-4 py-2 border border-[#BCC8BC] rounded-md focus:ring-2 focus:ring-blue-500 w-full md:w-48 lg:w-64 text-sm"
              />
            </div>
            <div className="flex gap-2 sm:gap-3 flex-wrap">
              {/* Priority Filter */}
              <select
                value={filterPriority}
                onChange={(e) => dispatch(setFilterPriority(e.target.value))}
                className="px-2 sm:px-2.5 py-2 border border-[#BCC8BC] rounded-md cursor-pointer focus:ring-2 focus:ring-blue-500 text-sm flex-1 sm:flex-none"
              >
                <option value="All">All Priority</option>
                {taskPriorities.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => dispatch(setFilterCategory(e.target.value))}
                className="px-2 sm:px-2.5 py-2 border border-[#BCC8BC] rounded-md cursor-pointer focus:ring-2 focus:ring-blue-500 text-sm flex-1 sm:flex-none"
              >
                <option value="All">All Category</option>
                {taskCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {/* Add Task Button */}
              <button
                onClick={() => openTaskEdit(null)}
                className="px-2.5 py-2 bg-blue-200 text-[#2f362f] rounded-md cursor-pointer font-semibold flex items-center gap-1 sm:gap-2 transition-all text-sm whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Task</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Task Columns - Responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-3">
        <TaskColumn
          title="Active"
          tasks={activeTasks}
          icon={ListTodo}
          color="blue"
        />
        <TaskColumn
          title="On Hold"
          tasks={onHoldTasks}
          icon={PauseCircle}
          color="yellow"
        />
        <TaskColumn
          title="Completed"
          tasks={completedTasks}
          icon={CheckCircle2}
          color="green"
        />
        <TaskColumn
          title="Cancelled"
          tasks={cancelledTasks}
          icon={XCircle}
          color="red"
        />
      </div>

      {/* Add / Edit Modal */}
      <AddTaskModal
        open={taskEditModal.open}
        onClose={closeTaskEdit}
        mode={taskEditModal.data ? "edit" : "add"}
        initialData={taskEditModal.data}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialog.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        taskTitle={deleteDialog.taskTitle}
      />
    </div>
  );
};

export default TasksPage;
