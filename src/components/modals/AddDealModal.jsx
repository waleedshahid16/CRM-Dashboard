/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/incompatible-library */
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import RichTextEditor from "../common/RichTextEditor";
import { addDeal, updateDeal } from "../../store/slices/dealsSlice";
import {
  X,
  Plus,
  DollarSign,
  Calendar,
  User,
  Building2,
  Bold,
  Italic,
  Underline,
  Link,
  List,
  ListOrdered,
  Type,
} from "lucide-react";

const dealSchema = yup
  .object({
    dealName: yup
      .string()
      .required("Deal name is required")
      .min(3, "Deal name must be at least 3 characters"),
    pipeline: yup.string().required("Pipeline is required"),
    status: yup.string().required("Status is required"),
    dealValue: yup.string().required("Deal value is required"),
    currency: yup.string().required("Currency is required"),
    period: yup.string().required("Period is required"),
    periodValue: yup.string().nullable(),
    contact: yup.string().required("Contact is required"),
    project: yup.array().of(yup.string()),
    dueDate: yup.date().nullable(),
    expectedClosingDate: yup
      .date()
      .required("Expected closing date is required")
      .nullable(),
    assignee: yup.string().required("Assignee is required"),
    followUpDate: yup.date().nullable(),
    source: yup.string().required("Source is required"),
    tags: yup.array().of(yup.string()),
    priority: yup.string().required("Priority is required"),
    description: yup
      .string()
      .required("Description is required")
      .min(10, "Description must be at least 10 characters"),
  })
  .required();

const dealDefaultValues = {
  dealName: "",
  pipeline: "",
  status: "",
  dealValue: "",
  currency: "USD",
  period: "",
  periodValue: "",
  contact: "",
  project: [],
  dueDate: null,
  expectedClosingDate: null,
  assignee: "",
  followUpDate: null,
  source: "",
  tags: [],
  priority: "",
  description: "",
};

const AddDealModal = ({ open, onClose, initialData = null, mode = "add" }) => {
  const dispatch = useDispatch();
  const [tagInput, setTagInput] = useState("");
  const [projectInput, setProjectInput] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(dealSchema),
    defaultValues: dealDefaultValues,
  });

  const tags = watch("tags") || [];
  const project = watch("project") || [];
  const dealName = watch("dealName") || "";

  const pipelines = [
    "Sales Pipeline",
    "Marketing Pipeline",
    "Support Pipeline",
    "Custom Pipeline",
  ];
  const statuses = [
    "New",
    "In Progress",
    "Qualified",
    "Negotiation",
    "Closed Won",
    "Closed Lost",
  ];
  const currencies = ["USD", "EUR", "GBP", "PKR", "INR", "AED"];
  const periods = ["Monthly", "Quarterly", "Yearly", "One-time"];
  const sources = [
    "Website",
    "Referral",
    "Social Media",
    "Email Campaign",
    "Cold Call",
    "Event",
    "Partner",
    "Other",
  ];
  const priorities = ["Low", "Medium", "High", "Urgent"];
  const contacts = [
    "Darlee Robertson",
    "John Doe",
    "Jane Smith",
    "Mike Johnson",
  ];
  const assignees = [
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
          ...dealDefaultValues,
          ...initialData,
        });
      } else {
        reset(dealDefaultValues);
      }
    }
  }, [open, initialData, reset]);

  const isEdit = mode === "edit" && initialData;

  const handleClose = () => {
    reset(dealDefaultValues);
    setTagInput("");
    setProjectInput("");
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

  const handleAddProject = (e) => {
    if (e.key === "Enter" && projectInput.trim()) {
      e.preventDefault();
      if (!project.includes(projectInput.trim())) {
        setValue("project", [...project, projectInput.trim()]);
      }
      setProjectInput("");
    }
  };

  const handleDeleteProject = (projectToDelete) => {
    setValue(
      "project",
      project.filter((p) => p !== projectToDelete)
    );
  };

  const onSubmit = async (data) => {
    try {
      const dealData = {
        ...data,
        createdDate:
          initialData?.createdDate || new Date().toISOString().split("T")[0],
      };

      if (isEdit) {
        dispatch(updateDeal({ ...initialData, ...dealData }));
      } else {
        dispatch(addDeal(dealData));
      }
      handleClose();
    } catch (error) {
      console.error("Error saving deal:", error);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#f8faf9] rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl my-4 sm:my-8 max-h-[calc(100vh-2rem)] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Gradient Header */}
        <div className="bg-blue-200 p-4 sm:p-6 text-[#2f362f] sticky top-0 z-10">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-3 sm:items-center sm:gap-4 flex-1">
              {/* Deal Icon */}
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 sm:border-3 border-[#2f362f] flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold truncate">
                  {isEdit ? "Edit Deal" : "Add New Deal"}
                </h2>
                <p className="text-xs sm:text-sm opacity-90 mt-1 line-clamp-2">
                  {isEdit
                    ? "Update deal information"
                    : "Create a new deal in your pipeline"}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1 sm:p-1.5 hover:bg-white/20 rounded-md transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 bg-[#FEFDFC]"
        >
          <div className="space-y-4">
            {/* Deal Name */}
            <div>
              <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                Deal Name <span className="text-red-500">*</span>
              </label>
              <Controller
                name="dealName"
                control={control}
                render={({ field }) => (
                  <div>
                    <input
                      {...field}
                      placeholder="Enter deal name"
                      className={`w-full px-2.5 py-2 text-sm sm:text-base border rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                        errors.dealName ? "border-red-500" : "border-[#BCC8BC]"
                      }`}
                    />
                    {errors.dealName && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.dealName.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Pipeline and Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Pipeline */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-[#2f362f]">
                    Pipeline <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add New
                  </button>
                </div>
                <Controller
                  name="pipeline"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <select
                        {...field}
                        className={`w-full px-2.5 py-2 text-sm sm:text-base border rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                          errors.pipeline
                            ? "border-red-500"
                            : "border-[#BCC8BC]"
                        }`}
                      >
                        <option value="">Choose</option>
                        {pipelines.map((pipeline) => (
                          <option key={pipeline} value={pipeline}>
                            {pipeline}
                          </option>
                        ))}
                      </select>
                      {errors.pipeline && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.pipeline.message}
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
                        className={`w-full px-2.5 py-2 text-sm sm:text-base border rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                          errors.status ? "border-red-500" : "border-[#BCC8BC]"
                        }`}
                      >
                        <option value="">Choose</option>
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

            {/* Deal Value and Currency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Deal Value */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Deal Value <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="dealValue"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <input
                        {...field}
                        placeholder="Enter deal value"
                        className={`w-full px-2.5 py-2 text-sm sm:text-base border rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                          errors.dealValue
                            ? "border-red-500"
                            : "border-[#BCC8BC]"
                        }`}
                      />
                      {errors.dealValue && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.dealValue.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Currency */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Currency <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="currency"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <select
                        {...field}
                        className={`w-full px-2.5 py-2 text-sm sm:text-base border rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                          errors.currency
                            ? "border-red-500"
                            : "border-[#BCC8BC]"
                        }`}
                      >
                        <option value="">Choose</option>
                        {currencies.map((currency) => (
                          <option key={currency} value={currency}>
                            {currency}
                          </option>
                        ))}
                      </select>
                      {errors.currency && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.currency.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Period and Period Value */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Period */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Period <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="period"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <select
                        {...field}
                        className={`w-full px-2.5 py-2 text-sm sm:text-base border rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                          errors.period ? "border-red-500" : "border-[#BCC8BC]"
                        }`}
                      >
                        <option value="">Choose</option>
                        {periods.map((period) => (
                          <option key={period} value={period}>
                            {period}
                          </option>
                        ))}
                      </select>
                      {errors.period && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.period.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Period Value */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Period Value
                </label>
                <Controller
                  name="periodValue"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      value={field.value || ""}
                      placeholder="Enter period value"
                      className="w-full px-2.5 py-2 border border-[#BCC8BC] rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    />
                  )}
                />
              </div>
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                Contact <span className="text-red-500">*</span>
              </label>
              <Controller
                name="contact"
                control={control}
                render={({ field }) => (
                  <div>
                    <div className="flex items-center gap-2 px-2.5 py-2 border rounded-md focus-within:ring-2 focus-within:ring-red-500 focus-within:border-transparent transition-all border-[#BCC8BC] bg-white">
                      <User className="w-5 h-5 text-emerald-500" />
                      <select
                        {...field}
                        className="flex-1 border-none outline-none bg-transparent"
                      >
                        <option value="">Select contact</option>
                        {contacts.map((contact) => (
                          <option key={contact} value={contact}>
                            {contact}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.contact && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.contact.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Project */}
            <div>
              <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                Project
              </label>
              <div className="space-y-2">
                <input
                  value={projectInput}
                  onChange={(e) => setProjectInput(e.target.value)}
                  onKeyDown={handleAddProject}
                  placeholder="Type and press Enter to add project"
                  className="w-full px-2.5 py-2 border border-[#BCC8BC] rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
                {project.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.map((p) => (
                      <span
                        key={p}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        {p}
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(p)}
                          className="hover:text-blue-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Dates Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {/* Due Date */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Due Date
                </label>
                <Controller
                  name="dueDate"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-2 px-2.5 py-2 border border-[#BCC8BC] rounded-md focus-within:ring-2 focus-within:ring-red-500 focus-within:border-transparent transition-all bg-white">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <input
                        {...field}
                        type="date"
                        value={field.value || ""}
                        className="flex-1 border-none outline-none bg-transparent"
                      />
                    </div>
                  )}
                />
              </div>

              {/* Expected Closing Date */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Expected Closing Date <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="expectedClosingDate"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <div className="flex items-center gap-2 px-2.5 py-2 border rounded-md focus-within:ring-2 focus-within:ring-red-500 focus-within:border-transparent transition-all border-[#BCC8BC] bg-white">
                        <Calendar className="w-5 h-5 text-green-500" />
                        <input
                          {...field}
                          type="date"
                          value={field.value || ""}
                          className="flex-1 border-none outline-none bg-transparent"
                        />
                      </div>
                      {errors.expectedClosingDate && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.expectedClosingDate.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Follow-up Date */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Follow-up Date
                </label>
                <Controller
                  name="followUpDate"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-2 px-2.5 py-2 border border-[#BCC8BC] rounded-md focus-within:ring-2 focus-within:ring-red-500 focus-within:border-transparent transition-all bg-white">
                      <Calendar className="w-5 h-5 text-purple-500" />
                      <input
                        {...field}
                        type="date"
                        value={field.value || ""}
                        className="flex-1 border-none outline-none bg-transparent"
                      />
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                Assignee <span className="text-red-500">*</span>
              </label>
              <Controller
                name="assignee"
                control={control}
                render={({ field }) => (
                  <div>
                    <div className="flex items-center gap-2 px-2.5 py-2 border rounded-md focus-within:ring-2 focus-within:ring-red-500 focus-within:border-transparent transition-all border-[#BCC8BC] bg-white">
                      <User className="w-5 h-5 text-indigo-500" />
                      <select
                        {...field}
                        className="flex-1 border-none outline-none bg-transparent"
                      >
                        <option value="">Select assignee</option>
                        {assignees.map((assignee) => (
                          <option key={assignee} value={assignee}>
                            {assignee}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.assignee && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.assignee.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Source and Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Source */}
              <div>
                <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                  Source <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="source"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <select
                        {...field}
                        className={`w-full px-2.5 py-2 text-sm sm:text-base border rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                          errors.source ? "border-red-500" : "border-[#BCC8BC]"
                        }`}
                      >
                        <option value="">Choose</option>
                        {sources.map((source) => (
                          <option key={source} value={source}>
                            {source}
                          </option>
                        ))}
                      </select>
                      {errors.source && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.source.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

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
                        className={`w-full px-2.5 py-2 text-sm sm:text-base border rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                          errors.priority
                            ? "border-red-500"
                            : "border-[#BCC8BC]"
                        }`}
                      >
                        <option value="">Choose</option>
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
                  placeholder="Type and press Enter to add tags"
                  className="w-full px-2.5 py-2 border border-[#BCC8BC] rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleDeleteTag(tag)}
                          className="hover:text-red-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Description with Rich Text Editor */}
            <div>
              <label className="block text-sm font-semibold text-[#2f362f] mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.description?.message}
                    placeholder="Enter deal description..."
                  />
                )}
              />
            </div>
          </div>
        </form>

        {/* Footer with Action Buttons */}
        <div className="p-6 bg-white border-t border-slate-200">
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 p-3 sm:p-4 bg-white border-t border-gray-200 sticky bottom-0">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm sm:text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm sm:text-base font-medium text-[#2f362f] bg-blue-200 border border-transparent rounded-md shadow-sm hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save Deal"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDealModal;
