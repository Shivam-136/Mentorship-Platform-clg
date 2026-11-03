import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts (loaded directly for instant shell rendering)
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import MenteeLayout from './layouts/MenteeLayout';
import MentorLayout from './layouts/MentorLayout';

// UI Components
import ToastContainer from './components/ui/Toast';
import LoadingSpinner from './components/ui/LoadingSpinner';
import Button from './components/ui/Button';
import { Link } from 'react-router-dom';

// 1. Lazy-loaded Public Pages
const Home = lazy(() => import('./pages/public/Home'));
const About = lazy(() => import('./pages/public/About'));
const HowItWorks = lazy(() => import('./pages/public/HowItWorks'));
const FindMentors = lazy(() => import('./pages/public/FindMentors'));
const MentorProfile = lazy(() => import('./pages/public/MentorProfile'));
const Faq = lazy(() => import('./pages/public/Faq'));
const Contact = lazy(() => import('./pages/public/Contact'));

// 2. Lazy-loaded Auth Pages
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));

// 3. Lazy-loaded Mentee Dashboard Pages
const MenteeDashboard = lazy(() => import('./pages/mentee/Dashboard'));
const MenteeFindMentors = lazy(() => import('./pages/mentee/FindMentors'));
const MenteeBookings = lazy(() => import('./pages/mentee/Bookings'));
const MenteeUpcomingSessions = lazy(() => import('./pages/mentee/UpcomingSessions'));
const MenteeSessionHistory = lazy(() => import('./pages/mentee/SessionHistory'));
const MentorshipProgress = lazy(() => import('./pages/mentee/Progress'));
const MenteeReviews = lazy(() => import('./pages/mentee/Reviews'));
const MenteeNotifications = lazy(() => import('./pages/mentee/Notifications'));
const MenteeProfile = lazy(() => import('./pages/mentee/Profile'));
const MenteeSettings = lazy(() => import('./pages/mentee/Settings'));

// 4. Lazy-loaded Mentor Dashboard Pages
const MentorDashboard = lazy(() => import('./pages/mentor/Dashboard'));
const MentorProfilePage = lazy(() => import('./pages/mentor/Profile'));
const MentorServices = lazy(() => import('./pages/mentor/Services'));
const MentorBookingRequests = lazy(() => import('./pages/mentor/BookingRequests'));
const MentorUpcomingSessions = lazy(() => import('./pages/mentor/UpcomingSessions'));
const MentorSessionHistory = lazy(() => import('./pages/mentor/SessionHistory'));
const MentorAvailability = lazy(() => import('./pages/mentor/Availability'));
const MentorEarnings = lazy(() => import('./pages/mentor/Earnings'));
const MentorReviews = lazy(() => import('./pages/mentor/Reviews'));
const MentorNotifications = lazy(() => import('./pages/mentor/Notifications'));
const MentorSettings = lazy(() => import('./pages/mentor/Settings'));

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
      <Suspense fallback={<LoadingSpinner fullPage message="Loading..." />}>
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
      </Suspense>
    </BrowserRouter>
  );
}
