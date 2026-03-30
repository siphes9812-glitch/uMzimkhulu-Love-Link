import * as React from "react";
import { Component, ErrorInfo, ReactNode } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import { Splash } from "./screens/Splash";
import { Welcome } from "./screens/Welcome";
import { Login } from "./screens/Login";
import { Register } from "./screens/Register";
import { Onboarding } from "./screens/Onboarding";
import { Discover } from "./screens/Discover";
import { Matches } from "./screens/Matches";
import { ChatList } from "./screens/ChatList";
import { ChatDetail } from "./screens/ChatDetail";
import { Profile } from "./screens/Profile";
import { EditProfile } from "./screens/EditProfile";
import { Settings } from "./screens/Settings";
import { AdminDashboard } from "./screens/AdminDashboard";
import { Navbar } from "./components/Navbar";

// Error Boundary
interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  errorInfo: string | null;
}

class ErrorBoundary extends (Component as any) {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorInfo: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-gray-50">
          <h1 className="text-2xl font-bold text-red-600">Something went wrong.</h1>
          <p className="mt-2 text-gray-600">We're sorry for the inconvenience. Please try refreshing the page.</p>
          {this.state.errorInfo && (
            <pre className="p-4 mt-4 text-xs text-left bg-gray-100 rounded-lg overflow-auto max-w-full">
              {this.state.errorInfo}
            </pre>
          )}
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 mt-6 text-white bg-pink-500 rounded-full hover:bg-pink-600 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, loading, isAuthReady } = useAuth();

  if (loading || !isAuthReady) return <Splash />;
  if (!user) return <Navigate to="/welcome" />;
  if (user && !profile) return <Navigate to="/onboarding" />;

  return <>{children}</>;
};

const AppContent = () => {
  const { user, profile } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="flex-grow pb-16 md:pb-0">
        <Routes>
          <Route path="/splash" element={<Splash />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding" element={<Onboarding />} />
          
          <Route path="/" element={<ProtectedRoute><Discover /></ProtectedRoute>} />
          <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
          <Route path="/chats" element={<ProtectedRoute><ChatList /></ProtectedRoute>} />
          <Route path="/chat/:matchId" element={<ProtectedRoute><ChatDetail /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {user && profile && <Navbar />}
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
