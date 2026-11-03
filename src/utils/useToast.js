import { useDispatch } from 'react-redux';
import { addToast } from '../store/slices/uiSlice';

export function useToast() {
  const dispatch = useDispatch();

  return {
    success: (message, title = 'Success') => {
      dispatch(addToast({ type: 'success', title, message }));
    },
    error: (message, title = 'Error') => {
      dispatch(addToast({ type: 'error', title, message }));
    },
    warning: (message, title = 'Warning') => {
      dispatch(addToast({ type: 'warning', title, message }));
    },
    info: (message, title = 'Notice') => {
      dispatch(addToast({ type: 'info', title, message }));
    },
  };
}

export default useToast;

