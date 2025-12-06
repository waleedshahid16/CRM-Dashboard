/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/incompatible-library */
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { addTask, updateTask } from "../../store/slices/tasksSlice";
import {
  X,
  Plus,
  CheckSquare,
  Calendar,
  User,
  Tag,
  AlertCircle,
} from "lucide-react";

const taskSchema = yup
  .object({
    title: yup
      .string()
      .required("Task title is required")
      .min(3, "Title must be at least 3 characters"),
    category: yup.string().required("Category is required"),
    responsiblePersons: yup
      .array()
      .of(yup.string())
      .min(1, "At least one responsible person is required"),
    startDate: yup.date().required("Start date is required").nullable(),
    dueDate: yup.date().required("Due date is required").nullable(),
    tags: yup.array().of(yup.string()),
    priority: yup.string().required("Priority is required"),
    status: yup.string().required("Status is required"),
    description: yup
      .string()
      .required("Description is required")
      .min(10, "Description must be at least 10 characters"),
  })
  .required();

const taskDefaultValues = {
  title: "",
  category: "",
  responsiblePersons: [],
  startDate: null,
  dueDate: null,
  tags: [],
  priority: "",
  status: "Active",
  description: "",
};

const AddTaskModal = ({ open, onClose, initialData = null, mode = "add" }) => {
  const dispatch = useDispatch();
  const [tagInput, setTagInput] = useState("");
  const [personInput, setPersonInput] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(taskSchema),
    defaultValues: taskDefaultValues,
  });

  const tags = watch("tags") || [];
  const responsiblePersons = watch("responsiblePersons") || [];

  const categories = [
    "Sales",
    "Marketing",
    "Customer Success",
    "Admin",
    "Management",
    "Legal",
    "Finance",
    "Technical",
    "Other",
  ];

  const priorities = ["Low", "Medium", "High", "Urgent"];

  const statuses = ["Active", "On Hold", "Completed", "Cancelled"];

  const availablePersons = [
    "Darlee Robertson",
    "Sharon Roy",
    "John Doe",
    "Jane Smith",
    "Mike Johnson",
    "Sarah Williams",
  ];

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          ...taskDefaultValues,
          ...initialData,
        });
      } else {
        reset(taskDefaultValues);
      }
    }
  }, [open, initialData, reset]);

  const isEdit = mode === "edit" && initialData;

  const handleClose = () => {
    reset(taskDefaultValues);
    setTagInput("");
    setPersonInput("");
    onClose();
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setValue("tags", [...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setValue(
      "tags",
      tags.filter((tag) => tag !== tagToDelete)
    );
  };

  const handleAddPerson = (person) => {
    if (!responsiblePersons.includes(person)) {
      setValue("responsiblePersons", [...responsiblePersons, person]);
    }
    setPersonInput("");
  };

  const handleDeletePerson = (personToDelete) => {
    setValue(
      "responsiblePersons",
      responsiblePersons.filter((p) => p !== personToDelete)
    );
  };

  const onSubmit = async (data) => {
    try {
      const taskData = {
        ...data,
        createdDate:
          initialData?.createdDate || new Date().toISOString().split("T")[0],
        completedDate:
          data.status === "Completed"
            ? new Date().toISOString().split("T")[0]
            : null,
      };

      if (isEdit) {
        dispatch(updateTask({ ...initialData, ...taskData }));
      } else {
        dispatch(addTask(taskData));
      }
      handleClose();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#f8faf9] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Gradient Header */}
        <div className="bg-blue-200 p-6 text-[#2f362f]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Task Icon */}
              <div className="w-14 h-14 rounded-full border-3 border-[#2f362f] flex items-center justify-center">
                <CheckSquare className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {isEdit ? "Edit Task" : "Add New Task"}
                </h2>
                <p className="text-sm opacity-90 mt-1">
                  {isEdit
                    ? "Update task information"
                    : "Create a new task and assign it"}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 hover:bg-white/20 rounded-md transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto p-6 bg-[#FEFDFC]"
        >
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <div>
                    <input
                      {...field}
                      placeholder="Enter task title"
                      className={`w-full px-2.5 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.title ? "border-red-500" : "border-[#BCC8BC]"
                      }`}
                    />
                    {errors.title && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.title.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <div>
                    <select
                      {...field}
                      className={`w-full px-2.5 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.category ? "border-red-500" : "border-[#BCC8BC]"
                      }`}
                    >
                      <option value="">Choose</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.category.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Responsible Persons */}
            <div>
              <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                Responsible Persons <span className="text-red-500">*</span>
              </label>
              <Controller
                name="responsiblePersons"
                control={control}
                render={({ field }) => (
                  <div>
                    <div className="space-y-2">
                      <select
                        value={personInput}
                        onChange={(e) => {
                          const person = e.target.value;
                          if (person) {
                            handleAddPerson(person);
                          }
                        }}
                        className="w-full px-2.5 py-2 border border-[#BCC8BC] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select person to add</option>
                        {availablePersons.map((person) => (
                          <option key={person} value={person}>
                            {person}
                          </option>
                        ))}
                      </select>
                      {responsiblePersons.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {responsiblePersons.map((person) => (
                            <span
                              key={person}
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm"
                            >
                              <User className="w-3 h-3" />
                              {person}
                              <button
                                type="button"
                                onClick={() => handleDeletePerson(person)}
                                className="hover:text-blue-900"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {errors.responsiblePersons && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.responsiblePersons.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Start Date and Due Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <div className="flex items-center gap-2 px-2.5 py-2 border rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all border-[#BCC8BC] bg-white">
                        <Calendar className="w-5 h-5 text-green-500" />
                        <input
                          {...field}
                          type="date"
                          value={field.value || ""}
                          placeholder="dd/mm/yyyy"
                          className="flex-1 border-none outline-none bg-transparent"
                        />
                      </div>
                      {errors.startDate && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.startDate.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="dueDate"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <div className="flex items-center gap-2 px-2.5 py-2 border rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all border-[#BCC8BC] bg-white">
                        <Calendar className="w-5 h-5 text-red-500" />
                        <input
                          {...field}
                          type="date"
                          value={field.value || ""}
                          placeholder="dd/mm/yyyy"
                          className="flex-1 border-none outline-none bg-transparent"
                        />
                      </div>
                      {errors.dueDate && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.dueDate.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                Tags
              </label>
              <div className="space-y-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Enter value separated by comma"
                  className="w-full px-2.5 py-2 border border-[#BCC8BC] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#FEFDFC] text-[#2f362f] rounded text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleDeleteTag(tag)}
                          className="hover:text-slate-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Priority and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Priority */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Priority <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <select
                        {...field}
                        className={`w-full px-2.5 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.priority
                            ? "border-red-500"
                            : "border-[#BCC8BC]"
                        }`}
                      >
                        <option value="">Select</option>
                        {priorities.map((priority) => (
                          <option key={priority} value={priority}>
                            {priority}
                          </option>
                        ))}
                      </select>
                      {errors.priority && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.priority.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <select
                        {...field}
                        className={`w-full px-2.5 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.status ? "border-red-500" : "border-[#BCC8BC]"
                        }`}
                      >
                        <option value="">Select</option>
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      {errors.status && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.status.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <div>
                    <textarea
                      {...field}
                      placeholder="Enter task description..."
                      rows={6}
                      className={`w-full px-2.5 py-3 border rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.description
                          ? "border-red-500"
                          : "border-[#BCC8BC]"
                      }`}
                    />
                    {errors.description && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
        </form>

        {/* Footer with Action Buttons */}
        <div className="p-6 bg-white border-t border-slate-200">
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-2.5 py-2 border border-[#BCC8BC] text-[#2f362f] rounded-md hover:bg-slate-50 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="px-2.5 py-2 bg-blue-200 text-[#2f362f] border-[#BCC8BC] rounded-md transition-all font-medium shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:opacity-90 text-sm"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#BCC8BC] rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <CheckSquare className="w-4 h-4" />
                  {isEdit ? "Update" : "Create"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
