import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import MenteeLayout from './layouts/MenteeLayout';
import MentorLayout from './layouts/MentorLayout';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import HowItWorks from './pages/public/HowItWorks';
import FindMentors from './pages/public/FindMentors';
import MentorProfile from './pages/public/MentorProfile';
import Faq from './pages/public/Faq';
import Contact from './pages/public/Contact';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Mentee Dashboard Pages
import MenteeDashboard from './pages/mentee/Dashboard';
import MenteeFindMentors from './pages/mentee/FindMentors';
import MenteeBookings from './pages/mentee/Bookings';
import MenteeUpcomingSessions from './pages/mentee/UpcomingSessions';
import MenteeSessionHistory from './pages/mentee/SessionHistory';
import MentorshipProgress from './pages/mentee/Progress';
import MenteeReviews from './pages/mentee/Reviews';
import MenteeNotifications from './pages/mentee/Notifications';
import MenteeProfile from './pages/mentee/Profile';
import MenteeSettings from './pages/mentee/Settings';

// Mentor Dashboard Pages
import MentorDashboard from './pages/mentor/Dashboard';
import MentorProfilePage from './pages/mentor/Profile';
import MentorServices from './pages/mentor/Services';
import MentorBookingRequests from './pages/mentor/BookingRequests';
import MentorUpcomingSessions from './pages/mentor/UpcomingSessions';
import MentorSessionHistory from './pages/mentor/SessionHistory';
import MentorAvailability from './pages/mentor/Availability';
import MentorEarnings from './pages/mentor/Earnings';
import MentorReviews from './pages/mentor/Reviews';
import MentorNotifications from './pages/mentor/Notifications';
import MentorSettings from './pages/mentor/Settings';

// UI Components
import ToastContainer from './components/ui/Toast';

// 404 Page
import Button from './components/ui/Button';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <span className="text-6xl font-black text-brand-600">404</span>
      <h2 className="text-2xl font-bold text-slate-900">Page not found</h2>
      <p className="text-sm text-slate-500 max-w-sm">
        The page you are looking for might have been moved or does not exist.
      </p>
      <Link to="/">
        <Button size="md">Return to Homepage</Button>
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* 1. Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/mentors" element={<FindMentors />} />
          <Route path="/mentors/:id" element={<MentorProfile />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* 2. Authentication Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        {/* 3. Mentee Dashboard Routes */}
        <Route path="/mentee" element={<MenteeLayout />}>
          <Route index element={<Navigate to="/mentee/dashboard" replace />} />
          <Route path="dashboard" element={<MenteeDashboard />} />
          <Route path="mentors" element={<MenteeFindMentors />} />
          <Route path="bookings" element={<MenteeBookings />} />
          <Route path="upcoming-sessions" element={<MenteeUpcomingSessions />} />
          <Route path="session-history" element={<MenteeSessionHistory />} />
          <Route path="progress" element={<MentorshipProgress />} />
          <Route path="reviews" element={<MenteeReviews />} />
          <Route path="notifications" element={<MenteeNotifications />} />
          <Route path="profile" element={<MenteeProfile />} />
          <Route path="settings" element={<MenteeSettings />} />
        </Route>

        {/* 4. Mentor Dashboard Routes */}
        <Route path="/mentor" element={<MentorLayout />}>
          <Route index element={<Navigate to="/mentor/dashboard" replace />} />
          <Route path="dashboard" element={<MentorDashboard />} />
          <Route path="profile" element={<MentorProfilePage />} />
          <Route path="services" element={<MentorServices />} />
          <Route path="booking-requests" element={<MentorBookingRequests />} />
          <Route path="upcoming-sessions" element={<MentorUpcomingSessions />} />
          <Route path="session-history" element={<MentorSessionHistory />} />
          <Route path="availability" element={<MentorAvailability />} />
          <Route path="earnings" element={<MentorEarnings />} />
          <Route path="reviews" element={<MentorReviews />} />
          <Route path="notifications" element={<MentorNotifications />} />
          <Route path="settings" element={<MentorSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
