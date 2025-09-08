import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import AuthPage from "./components/LoginScreen";
import Dashboard from "./components/DesignerDashboard";
import NotFound from "./pages/NotFound";
import { getUser } from "./utils/auth";
import ComplianceUploadCenter from "./components/ComplianceUploadCenter";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const user = getUser();
  return user ? children : <Navigate to="/auth" replace />;
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
  path="/compliance"
  element={
    <ProtectedRoute>
      <ComplianceUploadCenter userName={getUser()?.name} onBack={() => window.history.back()} />
    </ProtectedRoute>
  }
/>
          <Route
          path="/auth"
          element={<AuthPage onAuthSuccess={(user, token) => {
            // redirect after login
            window.location.href = "/dashboard";
          }} />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
