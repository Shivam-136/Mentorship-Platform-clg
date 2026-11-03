// Safe LocalStorage utility for persisting real user-generated data

const STORAGE_KEYS = {
  AUTH_SESSION: 'mp_auth_session',
  USER_BOOKINGS: 'mp_user_bookings',
  BOOKING_REQUESTS: 'mp_booking_requests',
  MENTOR_SERVICES: 'mp_mentor_services',
  MENTOR_AVAILABILITY: 'mp_mentor_availability',
  USER_PROGRESS: 'mp_user_progress',
  USER_NOTIFICATIONS: 'mp_user_notifications',
  USER_EARNINGS: 'mp_user_earnings',
};

export const loadState = (key, fallback = null) => {
  try {
    const serialized = localStorage.getItem(key);
    if (serialized === null) {
      return fallback;
    }
    return JSON.parse(serialized);
  } catch (err) {
    console.warn(`Failed to load state for key "${key}":`, err);
    return fallback;
  }
};

export const saveState = (key, value) => {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (err) {
    console.warn(`Failed to save state for key "${key}":`, err);
  }
};

export const removeState = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn(`Failed to remove state for key "${key}":`, err);
  }
};

export { STORAGE_KEYS };

