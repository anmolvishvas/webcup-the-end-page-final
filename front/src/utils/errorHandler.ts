import { NavigateFunction } from 'react-router-dom';

export const handleApiError = (
  error: unknown,
  navigate: NavigateFunction,
  setShowScene?: (show: boolean) => void
) => {
  if (setShowScene) {
    setShowScene(false);
  }

  // Handle API error responses
  const status = (error as any)?.response?.status;

  // Navigate to error page with status
  navigate('*', { 
    state: { status: status || 'generic' },
    replace: true 
  });
}; 