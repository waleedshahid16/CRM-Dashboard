import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import LoadingSpinner from "./components/shared/LoadingSpinner";
import ErrorBoundary from "./components/ErrorBoundary";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const ClientsPage = lazy(() => import("./pages/ClientsPage"));
const CompaniesPage = lazy(() => import("./pages/CompaniesPage"));
const DealsPage = lazy(() => import("./pages/DealsPage"));
const TasksPage = lazy(() => import("./pages/TasksPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const ReportsPage = lazy(() => import("./pages/ReportsPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const HelpSupportPage = lazy(() => import("./pages/HelpSupportPage"));
const ClientDetailPage = lazy(() => import("./components/detail-pages/ClientDetailPage"));
const CompanyDetailPage = lazy(() => import("./components/detail-pages/CompanyDetailPage"));
const SignInPage = lazy(() => import("./auth/SignInPage"));
const RegisterPage = lazy(() => import("./auth/RegisterPage"));

const PageLoader = () => <LoadingSpinner size="lg" text="Loading..." />;

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<Suspense fallback={<PageLoader />}><SignInPage /></Suspense>} />
          <Route path="/register" element={<Suspense fallback={<PageLoader />}><RegisterPage /></Suspense>} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
            <Route path="clients" element={<Suspense fallback={<PageLoader />}><ClientsPage /></Suspense>} />
            <Route path="clients/:id" element={<Suspense fallback={<PageLoader />}><ClientDetailPage /></Suspense>} />
            <Route path="companies" element={<Suspense fallback={<PageLoader />}><CompaniesPage /></Suspense>} />
            <Route path="companies/:id" element={<Suspense fallback={<PageLoader />}><CompanyDetailPage /></Suspense>} />
            <Route path="deals" element={<Suspense fallback={<PageLoader />}><DealsPage /></Suspense>} />
            <Route path="tasks" element={<Suspense fallback={<PageLoader />}><TasksPage /></Suspense>} />
            <Route path="analytics" element={<Suspense fallback={<PageLoader />}><AnalyticsPage /></Suspense>} />
            <Route path="reports" element={<Suspense fallback={<PageLoader />}><ReportsPage /></Suspense>} />
            <Route path="settings" element={<Suspense fallback={<PageLoader />}><SettingsPage /></Suspense>} />
            <Route path="help" element={<Suspense fallback={<PageLoader />}><HelpSupportPage /></Suspense>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
