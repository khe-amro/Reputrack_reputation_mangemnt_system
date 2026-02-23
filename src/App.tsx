import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";

// Public Pages
import Index from "./pages/Index";
import Companies from "./pages/Companies";
import CompanyProfile from "./pages/company/CompanyProfile";
import WriteReview from "./pages/company/WriteReview";
import NotFound from "./pages/NotFound";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Customer Pages
import MyReviews from "./pages/customer/MyReviews";

// Business Pages
import BusinessDashboard from "./pages/business/BusinessDashboard";
import BusinessReviews from "./pages/business/BusinessReviews";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/company/:slug" element={<CompanyProfile />} />
            <Route path="/company/:slug/review" element={<WriteReview />} />
            
            {/* Auth Routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            
            {/* Customer Routes */}
            <Route path="/my-reviews" element={<MyReviews />} />
            
            {/* Business Routes */}
            <Route path="/business" element={<BusinessDashboard />} />
            <Route path="/business/reviews" element={<BusinessReviews />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
