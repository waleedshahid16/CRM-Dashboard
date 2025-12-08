/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Mail,
  Key,
  Camera,
  Save,
  ChevronRight,
  Users,
  Building2,
  Handshake,
  CheckSquare,
  TrendingUp,
  Download,
  Trash2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
// Redux selectors and actions
import { selectTheme, setTheme } from "../store/slices/uiSlice";
import {
  selectTotalClients,
  selectActiveClients,
} from "../store/slices/clientsSlice";
import { selectAllCompanies } from "../store/slices/companiesSlice";
import { selectAllDeals } from "../store/slices/dealsSlice";
import { selectAllTasks } from "../store/slices/tasksSlice";
import { useNavigate } from "react-router-dom";

// Navigation

// Validation schemas
const profileSchema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
      "Please enter a valid phone number"
    ),
  company: yup
    .string()
    .required("Company name is required")
    .min(2, "Company name must be at least 2 characters"),
  role: yup.string().required("Role is required"),
  timezone: yup.string().required("Timezone is required"),
  language: yup.string().required("Language is required"),
});

const securitySchema = yup.object({
  currentPassword: yup.string().when("newPassword", {
    is: (val) => val && val.length > 0,
    then: (schema) => schema.required("Current password is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
  sessionTimeout: yup.string().required("Session timeout is required"),
});

const notificationSchema = yup.object({
  emailNotifications: yup.boolean(),
  pushNotifications: yup.boolean(),
  weeklyDigest: yup.boolean(),
  dealAlerts: yup.boolean(),
  taskReminders: yup.boolean(),
});

const SettingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Redux state
  const currentTheme = useSelector(selectTheme);
  const totalClients = useSelector(selectTotalClients);
  const activeClients = useSelector(selectActiveClients);
  const companies = useSelector(selectAllCompanies);
  const deals = useSelector(selectAllDeals);
  const tasks = useSelector(selectAllTasks);

  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Profile form with yup validation
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isDirty: isProfileDirty },
    reset: resetProfile,
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+1 234 567 8900",
      company: "ClientHub Inc.",
      role: "Administrator",
      timezone: "UTC-5 (Eastern Time)",
      language: "English",
    },
    mode: "onChange",
  });

  // Security form with yup validation
  const {
    register: registerSecurity,
    handleSubmit: handleSecuritySubmit,
    formState: { errors: securityErrors },
    reset: resetSecurity,
    watch: watchSecurity,
  } = useForm({
    resolver: yupResolver(securitySchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      sessionTimeout: "30",
    },
    mode: "onChange",
  });

  // Notification form with yup validation
  const {
    register: registerNotification,
    handleSubmit: handleNotificationSubmit,
    formState: { errors: notificationErrors },
    watch: watchNotification,
  } = useForm({
    resolver: yupResolver(notificationSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      weeklyDigest: false,
      dealAlerts: true,
      taskReminders: true,
      twoFactorAuth: false,
    },
    mode: "onChange",
  });

  const notificationValues = watchNotification();

  // Memoized data statistics
  const dataStats = useMemo(() => {
    const activeCompanies = companies.filter(
      (c) => c.status === "Active"
    ).length;
    const wonDeals = deals.filter(
      (d) => d.status === "Closed Won" || d.status === "Won"
    ).length;
    const completedTasks = tasks.filter((t) => t.status === "Completed").length;
    const totalDealValue = deals.reduce((sum, deal) => {
      const value =
        parseFloat(
          String(deal.dealValue || deal.value || "0").replace(/[^0-9.]/g, "")
        ) || 0;
      return sum + value;
    }, 0);

    return {
      totalClients: totalClients.total,
      activeClients: activeClients.active,
      totalCompanies: companies.length,
      activeCompanies,
      totalDeals: deals.length,
      wonDeals,
      totalTasks: tasks.length,
      completedTasks,
      totalDealValue: `$${(totalDealValue / 1000).toFixed(1)}K`,
    };
  }, [totalClients, activeClients, companies, deals, tasks]);

  const handleThemeChange = useCallback(
    (theme) => {
      dispatch(setTheme(theme));
    },
    [dispatch]
  );

  const onProfileSubmit = async (data) => {
    setIsSaving(true);
    setSaveSuccess(false);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Profile data:", data);
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const onSecuritySubmit = async (data) => {
    setIsSaving(true);
    setSaveSuccess(false);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Security data:", data);
    resetSecurity({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      sessionTimeout: data.sessionTimeout,
    });
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const onNotificationSubmit = async (data) => {
    setIsSaving(true);
    setSaveSuccess(false);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Notification data:", data);
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "integrations", label: "Integrations", icon: Globe },
    { id: "data", label: "Data & Privacy", icon: Database },
  ];

  // Reusable Components
  const SettingSection = useCallback(
    ({ title, description, children }) => (
      <div className="bg-[#FEFDFC] rounded-lg p-6 shadow-sm border border-[#BCC8BC] mb-4">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-[#2f362f]">{title}</h3>
          {description && (
            <p className="text-sm text-[#2f362f] opacity-70">{description}</p>
          )}
        </div>
        {children}
      </div>
    ),
    []
  );

  const FormInput = ({ label, icon: Icon, error, ...props }) => (
    <div>
      <label className="block text-sm font-medium text-[#2f362f] mb-2">
        {Icon && <Icon className="w-4 h-4 inline mr-2" />}
        {label}
      </label>
      <input
        {...props}
        className={`w-full px-2.5 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent bg-[#f8faf9] ${
          error
            ? "border-red-500 focus:ring-red-300"
            : "border-[#BCC8BC] focus:ring-blue-500"
        }`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error.message}
        </p>
      )}
    </div>
  );

  const FormSelect = ({ label, icon: Icon, error, options, ...props }) => (
    <div>
      <label className="block text-sm font-medium text-[#2f362f] mb-2">
        {Icon && <Icon className="w-4 h-4 inline mr-2" />}
        {label}
      </label>
      <select
        {...props}
        className={`w-full px-2.5 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent bg-[#f8faf9] ${
          error
            ? "border-red-500 focus:ring-red-300"
            : "border-[#BCC8BC] focus:ring-blue-500"
        }`}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error.message}
        </p>
      )}
    </div>
  );

  const Toggle = useCallback(
    ({ label, description, error, ...props }) => (
      <div className="flex items-center justify-between py-2 border-b border-[#BCC8BC] last:border-b-0">
        <div>
          <p className="font-medium text-[#2f362f]">{label}</p>
          {description && (
            <p className="text-sm text-[#2f362f] opacity-70">{description}</p>
          )}
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" {...props} className="sr-only peer" />
          <div className="w-11 h-6 bg-[#BCC8BC] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
        </label>
      </div>
    ),
    []
  );

  const StatBadge = useCallback(
    ({ icon: Icon, label, value, color }) => (
      <div className="flex items-center gap-3 p-3 bg-[#f8faf9] rounded-lg border border-[#BCC8BC]">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs text-[#2f362f] opacity-70">{label}</p>
          <p className="font-bold text-[#2f362f]">{value}</p>
        </div>
      </div>
    ),
    []
  );

  const renderProfileSettings = () => (
    <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
      <SettingSection
        title="Personal Information"
        description="Update your personal details and contact information"
      >
        <div className="flex items-center gap-6 mb-6 pb-6 border-b border-[#BCC8BC]">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-[#BCC8BC] flex items-center justify-center text-[#2f362f] font-bold text-3xl shadow-md">
              JD
            </div>
            <button
              type="button"
              className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h4 className="font-bold text-[#2f362f] text-lg">John Doe</h4>
            <p className="text-[#2f362f] opacity-70">Administrator</p>
            <p className="text-sm text-[#2f362f] opacity-50">ClientHub Inc.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="First Name"
            type="text"
            {...registerProfile("firstName")}
            error={profileErrors.firstName}
          />
          <FormInput
            label="Last Name"
            type="text"
            {...registerProfile("lastName")}
            error={profileErrors.lastName}
          />
          <FormInput
            label="Email Address"
            icon={Mail}
            type="email"
            {...registerProfile("email")}
            error={profileErrors.email}
          />
          <FormInput
            label="Phone Number"
            type="tel"
            {...registerProfile("phone")}
            error={profileErrors.phone}
          />
        </div>
      </SettingSection>

      <SettingSection
        title="Organization"
        description="Your company and role information"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Company"
            type="text"
            {...registerProfile("company")}
            error={profileErrors.company}
          />
          <FormSelect
            label="Role"
            {...registerProfile("role")}
            error={profileErrors.role}
            options={["Administrator", "Manager", "Sales Rep", "Support Agent"]}
          />
        </div>
      </SettingSection>

      <SettingSection
        title="Localization"
        description="Set your language and timezone preferences"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            label="Language"
            icon={Globe}
            {...registerProfile("language")}
            error={profileErrors.language}
            options={["English", "Spanish", "French", "German"]}
          />
          <FormSelect
            label="Timezone"
            {...registerProfile("timezone")}
            error={profileErrors.timezone}
            options={[
              "UTC-5 (Eastern Time)",
              "UTC-6 (Central Time)",
              "UTC-7 (Mountain Time)",
              "UTC-8 (Pacific Time)",
              "UTC+0 (GMT)",
              "UTC+1 (Central European)",
              "UTC+5 (Pakistan Standard Time)",
            ]}
          />
        </div>
      </SettingSection>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving || !isProfileDirty}
          className="px-2.5 py-2 bg-blue-200 text-[#2f362f] rounded-md font-semibold flex items-center gap-2 hover:bg-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </form>
  );

  const renderNotificationSettings = () => (
    <form onSubmit={handleNotificationSubmit(onNotificationSubmit)}>
      <SettingSection
        title="Email Notifications"
        description="Manage your email notification preferences"
      >
        <Toggle
          {...registerNotification("emailNotifications")}
          label="Email Notifications"
          description="Receive email notifications for important updates"
        />
        <Toggle
          {...registerNotification("weeklyDigest")}
          label="Weekly Digest"
          description="Get a weekly summary of your activity"
        />
      </SettingSection>

      <SettingSection
        title="Push Notifications"
        description="Control in-app and browser push notifications"
      >
        <Toggle
          {...registerNotification("pushNotifications")}
          label="Push Notifications"
          description="Enable browser push notifications"
        />
        <Toggle
          {...registerNotification("dealAlerts")}
          label="Deal Alerts"
          description="Get notified when deals change status"
        />
        <Toggle
          {...registerNotification("taskReminders")}
          label="Task Reminders"
          description="Receive reminders for upcoming and overdue tasks"
        />
      </SettingSection>

      {/* Live Stats Preview */}
      <SettingSection
        title="Notification Statistics"
        description="Overview of your CRM data that triggers notifications"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatBadge
            icon={Handshake}
            label="Active Deals"
            value={dataStats.totalDeals - dataStats.wonDeals}
            color="bg-blue-100 text-blue-600"
          />
          <StatBadge
            icon={CheckSquare}
            label="Pending Tasks"
            value={dataStats.totalTasks - dataStats.completedTasks}
            color="bg-orange-100 text-orange-600"
          />
          <StatBadge
            icon={Users}
            label="Active Clients"
            value={dataStats.activeClients}
            color="bg-green-100 text-green-600"
          />
          <StatBadge
            icon={Building2}
            label="Companies"
            value={dataStats.totalCompanies}
            color="bg-purple-100 text-purple-600"
          />
        </div>
      </SettingSection>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="px-2.5 py-2 bg-blue-200 text-[#2f362f] rounded-md font-semibold flex items-center gap-2 hover:bg-blue-300 transition-colors disabled:opacity-50"
        >
          {isSaving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? "Saving..." : "Save Notifications"}
        </button>
      </div>
    </form>
  );

  const renderSecuritySettings = () => (
    <form onSubmit={handleSecuritySubmit(onSecuritySubmit)}>
      <SettingSection
        title="Password"
        description="Update your password regularly to keep your account secure"
      >
        <div className="space-y-4">
          <FormInput
            label="Current Password"
            icon={Key}
            type="password"
            placeholder="Enter current password"
            {...registerSecurity("currentPassword")}
            error={securityErrors.currentPassword}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="New Password"
              type="password"
              placeholder="Enter new password"
              {...registerSecurity("newPassword")}
              error={securityErrors.newPassword}
            />
            <FormInput
              label="Confirm New Password"
              type="password"
              placeholder="Confirm new password"
              {...registerSecurity("confirmPassword")}
              error={securityErrors.confirmPassword}
            />
          </div>
          {watchSecurity("newPassword") && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">Password requirements:</p>
              <ul className="text-xs text-blue-600 mt-1 space-y-1">
                <li
                  className={
                    watchSecurity("newPassword")?.length >= 8
                      ? "text-green-600"
                      : ""
                  }
                >
                  ✓ At least 8 characters
                </li>
                <li
                  className={
                    /[A-Z]/.test(watchSecurity("newPassword") || "")
                      ? "text-green-600"
                      : ""
                  }
                >
                  ✓ One uppercase letter
                </li>
                <li
                  className={
                    /[a-z]/.test(watchSecurity("newPassword") || "")
                      ? "text-green-600"
                      : ""
                  }
                >
                  ✓ One lowercase letter
                </li>
                <li
                  className={
                    /\d/.test(watchSecurity("newPassword") || "")
                      ? "text-green-600"
                      : ""
                  }
                >
                  ✓ One number
                </li>
              </ul>
            </div>
          )}
        </div>
      </SettingSection>

      <SettingSection
        title="Two-Factor Authentication"
        description="Add an extra layer of security to your account"
      >
        <Toggle
          {...registerNotification("twoFactorAuth")}
          label="Enable 2FA"
          description="Require a verification code when signing in"
        />
        {notificationValues.twoFactorAuth && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-700 font-medium">
              ✓ Two-factor authentication is enabled
            </p>
          </div>
        )}
      </SettingSection>

      <SettingSection
        title="Session Settings"
        description="Control your session preferences"
      >
        <FormSelect
          label="Session Timeout"
          {...registerSecurity("sessionTimeout")}
          error={securityErrors.sessionTimeout}
          options={["15", "30", "60", "120"]}
        />
        <p className="text-sm text-[#2f362f] opacity-70 mt-2">
          Session will expire after the selected time of inactivity (in minutes)
        </p>
      </SettingSection>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="px-2.5 py-2 bg-blue-200 text-[#2f362f] rounded-md font-semibold flex items-center gap-2 hover:bg-blue-300 transition-colors disabled:opacity-50"
        >
          {isSaving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? "Saving..." : "Update Security"}
        </button>
      </div>
    </form>
  );

  const renderAppearanceSettings = () => (
    <>
      <SettingSection
        title="Theme"
        description="Customize the look and feel of your dashboard"
      >
        <div className="grid grid-cols-3 gap-4">
          {["light", "dark", "system"].map((theme) => (
            <button
              key={theme}
              type="button"
              onClick={() => handleThemeChange(theme)}
              className={`p-4 rounded-lg border-2 transition-all ${
                currentTheme === theme
                  ? "border-blue-500 bg-blue-50"
                  : "border-[#BCC8BC] hover:border-blue-300"
              }`}
            >
              <div
                className={`w-full h-16 rounded mb-3 ${
                  theme === "light"
                    ? "bg-white border border-gray-200"
                    : theme === "dark"
                    ? "bg-gray-800"
                    : "bg-linear-to-r from-white to-gray-800"
                }`}
              />
              <p className="text-sm font-medium text-[#2f362f] capitalize">
                {theme}
              </p>
              {currentTheme === theme && (
                <span className="text-xs text-blue-600 font-medium">
                  Active
                </span>
              )}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-[#2f362f] opacity-70">
          Current theme:{" "}
          <span className="font-medium capitalize">{currentTheme}</span>
        </p>
      </SettingSection>

      <SettingSection
        title="Display Density"
        description="Choose how compact you want the interface to be"
      >
        <div className="flex gap-4">
          {["Comfortable", "Compact", "Spacious"].map((density) => (
            <button
              key={density}
              type="button"
              className="px-2.5 py-2 rounded-md border border-[#BCC8BC] hover:border-blue-300 hover:bg-blue-50 transition-all text-[#2f362f] font-medium"
            >
              {density}
            </button>
          ))}
        </div>
      </SettingSection>

      <SettingSection
        title="Sidebar Preferences"
        description="Customize sidebar behavior"
      >
        <div className="space-y-3">
          <Toggle
            label="Collapse sidebar by default"
            description="Start with a minimized sidebar on page load"
          />
          <Toggle
            label="Show icon labels"
            description="Display text labels next to sidebar icons"
            defaultChecked
          />
        </div>
      </SettingSection>
    </>
  );

  const renderIntegrationSettings = () => (
    <>
      <SettingSection
        title="Connected Apps"
        description="Manage your third-party integrations"
      >
        <div className="space-y-4">
          {[
            { name: "Google Calendar", status: "Connected", icon: "📅" },
            { name: "Slack", status: "Not connected", icon: "💬" },
            { name: "Zapier", status: "Connected", icon: "⚡" },
            { name: "Mailchimp", status: "Not connected", icon: "📧" },
          ].map((app) => (
            <div
              key={app.name}
              className="flex items-center justify-between p-4 bg-[#f8faf9] rounded-lg border border-[#BCC8BC]"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{app.icon}</span>
                <div>
                  <p className="font-medium text-[#2f362f]">{app.name}</p>
                  <p className="text-sm text-[#2f362f] opacity-70">
                    {app.status}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className={`px-2.5 py-2 rounded-md font-medium transition-colors ${
                  app.status === "Connected"
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-blue-200 text-[#2f362f] hover:bg-blue-300"
                }`}
              >
                {app.status === "Connected" ? "Disconnect" : "Connect"}
              </button>
            </div>
          ))}
        </div>
      </SettingSection>

      <SettingSection title="API Access" description="Manage your API keys">
        <div className="p-4 bg-[#f8faf9] rounded-lg border border-[#BCC8BC]">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[#2f362f]">API Key</p>
              <p className="text-sm text-[#2f362f] opacity-70 font-mono">
                ••••••••••••••••
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="px-3 py-1.5 bg-[#FEFDFC] border border-[#BCC8BC] rounded-md text-sm font-medium text-[#2f362f] hover:bg-gray-50 transition-colors"
              >
                Show
              </button>
              <button
                type="button"
                className="px-3 py-1.5 bg-[#FEFDFC] border border-[#BCC8BC] rounded-md text-sm font-medium text-[#2f362f] hover:bg-gray-50 transition-colors flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Regenerate
              </button>
            </div>
          </div>
        </div>
      </SettingSection>
    </>
  );

  const renderDataSettings = () => (
    <>
      {/* Data Overview - Connected to Redux */}
      <SettingSection
        title="Data Overview"
        description="Summary of your CRM data"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
            <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-[#2f362f]">
              {dataStats.totalClients}
            </p>
            <p className="text-sm text-[#2f362f] opacity-70">Total Clients</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 text-center">
            <Building2 className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-[#2f362f]">
              {dataStats.totalCompanies}
            </p>
            <p className="text-sm text-[#2f362f] opacity-70">Companies</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
            <Handshake className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-[#2f362f]">
              {dataStats.totalDeals}
            </p>
            <p className="text-sm text-[#2f362f] opacity-70">Total Deals</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 text-center">
            <TrendingUp className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-[#2f362f]">
              {dataStats.totalDealValue}
            </p>
            <p className="text-sm text-[#2f362f] opacity-70">Deal Value</p>
          </div>
        </div>
        <div className="p-3 bg-[#f8faf9] rounded-lg border border-[#BCC8BC]">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#2f362f]">
              <CheckSquare className="w-4 h-4 inline mr-2" />
              Tasks: {dataStats.completedTasks} / {dataStats.totalTasks}{" "}
              completed
            </span>
            <span className="text-[#2f362f]">
              Won Deals: {dataStats.wonDeals} / {dataStats.totalDeals}
            </span>
          </div>
        </div>
      </SettingSection>

      <SettingSection
        title="Data Export"
        description="Download your data in various formats"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { type: "Clients", count: dataStats.totalClients, icon: Users },
            { type: "Deals", count: dataStats.totalDeals, icon: Handshake },
            { type: "Tasks", count: dataStats.totalTasks, icon: CheckSquare },
          ].map(({ type, count, icon: Icon }) => (
            <button
              key={type}
              type="button"
              className="p-4 bg-[#f8faf9] rounded-lg border border-[#BCC8BC] hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-5 h-5 text-[#2f362f] opacity-70" />
                <Download className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="font-medium text-[#2f362f]">Export {type}</p>
              <p className="text-sm text-[#2f362f] opacity-70">
                {count} records • CSV, Excel, JSON
              </p>
            </button>
          ))}
        </div>
      </SettingSection>

      <SettingSection
        title="Data Retention"
        description="Configure how long we keep your data"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#f8faf9] rounded-lg border border-[#BCC8BC]">
            <div>
              <p className="font-medium text-[#2f362f]">Activity Logs</p>
              <p className="text-sm text-[#2f362f] opacity-70">
                How long to keep activity history
              </p>
            </div>
            <select className="px-2.5 py-2 border border-[#BCC8BC] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#FEFDFC]">
              <option>30 days</option>
              <option>90 days</option>
              <option>1 year</option>
              <option>Forever</option>
            </select>
          </div>
        </div>
      </SettingSection>

      <SettingSection
        title="Danger Zone"
        description="Irreversible actions that affect your account"
      >
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-red-700">Delete Account</p>
              <p className="text-sm text-red-600">
                Permanently delete your account and all {dataStats.totalClients}{" "}
                clients, {dataStats.totalDeals} deals, and{" "}
                {dataStats.totalTasks} tasks
              </p>
            </div>
            <button
              type="button"
              className="px-2.5 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </div>
        </div>
      </SettingSection>
    </>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileSettings();
      case "notifications":
        return renderNotificationSettings();
      case "security":
        return renderSecuritySettings();
      case "appearance":
        return renderAppearanceSettings();
      case "integrations":
        return renderIntegrationSettings();
      case "data":
        return renderDataSettings();
      default:
        return renderProfileSettings();
    }
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto bg-[#f8faf9] min-h-screen">
      {/* Success Toast */}
      {saveSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
          <div className="bg-green-500 text-white px-2.5 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Settings saved!</span>
          </div>
        </div>
      )}

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
          <span className="text-[#2f362f] font-medium">Settings</span>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2f362f] mb-1 sm:mb-2 tracking-tight">
              Settings
            </h1>
            <p className="text-[#2f362f] text-sm sm:text-base lg:text-lg">
              Manage your account settings
            </p>
          </div>
        </div>
      </div>

      {/* Main Content - Stack on mobile, side-by-side on desktop */}
      <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Sidebar Navigation - Horizontal scroll on mobile, vertical on desktop */}
        <div className="lg:col-span-1 order-first lg:order-none">
          {/* Mobile horizontal tabs */}
          <div className="lg:hidden overflow-x-auto pb-2 -mx-2 px-2">
            <div className="flex gap-2 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "bg-[#788978] text-white"
                      : "bg-[#FEFDFC] text-[#2f362f] border border-[#BCC8BC]"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Desktop vertical nav */}
          <div className="hidden lg:block bg-[#FEFDFC] rounded-lg shadow-sm border border-[#BCC8BC] overflow-hidden sticky top-4">
            <nav className="divide-y divide-[#BCC8BC]">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 transition-colors ${
                    activeTab === tab.id
                      ? "bg-[#788978] text-white"
                      : "text-[#2f362f] hover:bg-[#f8faf9]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 ${
                      activeTab === tab.id ? "text-white" : "text-[#BCC8BC]"
                    }`}
                  />
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">{renderContent()}</div>
      </div>
    </div>
  );
};

export default SettingsPage;
