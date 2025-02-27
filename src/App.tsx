import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import LoginForm from "./components/LoginForm";
import AppointmentList from "./components/AppointmentList";
import BlogPostForm from "./components/blog_post";
import CustomerReviews from "./components/reviewList";
import EmailSubscriptions from "./components/emailList";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <LoginForm />}
      />
      <Route
        path="/email-Subscriptions"
        element={
          <ProtectedRoute>
            <Layout>
              <EmailSubscriptions />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer-reviews"
        element={
          <ProtectedRoute>
            <Layout>
              <CustomerReviews />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/blog-post"
        element={
          <ProtectedRoute>
            <Layout>
              <BlogPostForm />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <AppointmentList />
            </Layout>
          </ProtectedRoute>
        }
      />3
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
