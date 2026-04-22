import { useCallback, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import toast from 'react-hot-toast';

// Custom hook for profile completeness management
export const useProfileCompleteness = () => {
  const {
    profileCompleteness,
    isLoading,
    isProfileComplete,
    canAccessManagement,
    redirectToProfileIfIncomplete,
    getProfileCompleteness,
    updateProfileCompleteness,
    getMissingFields,
    role,
    isLoggedIn
  } = useAuth();

  // Check and redirect if profile is incomplete
  const checkAndRedirect = useCallback((options = {}) => {
    const {
      showMessage = true,
      redirectPath = '/vendor/profile',
      message = 'Please complete your profile to access this feature.'
    } = options;

    if (!canAccessManagement() && isLoggedIn) {
      if (showMessage) {
        toast.error(message, {
          duration: 5000,
          position: 'top-center'
        });
      }
      
      window.location.href = redirectPath;
      return false;
    }
    
    return true;
  }, [canAccessManagement, isLoggedIn]);

  // Show profile completeness warning
  const showCompletenessWarning = useCallback(() => {
    if (!isProfileComplete() && role === 'vendor') {
      const missingFields = getMissingFields();
      const missingCount = missingFields.length;
      
      if (missingCount > 0) {
        toast.error(
          `Your profile is ${profileCompleteness}% complete. Please complete the missing fields: ${missingFields.slice(0, 3).join(', ')}${missingCount > 3 ? ` and ${missingCount - 3} more` : ''}`,
          {
            duration: 8000,
            position: 'top-center'
          }
        );
      }
    }
  }, [isProfileComplete, role, profileCompleteness, getMissingFields]);

  // Get profile status for UI display
  const getProfileStatus = useCallback(() => {
    return {
      isComplete: isProfileComplete(),
      percentage: profileCompleteness,
      canManage: canAccessManagement(),
      missingFields: getMissingFields(),
      isVendor: role === 'vendor',
      isLoading
    };
  }, [isProfileComplete, profileCompleteness, canAccessManagement, getMissingFields, role, isLoading]);

  // Protect function execution with profile check
  const protectFunction = useCallback((callback, options = {}) => {
    const {
      showMessage = true,
      redirectPath = '/vendor/profile',
      message = 'Please complete your profile to perform this action.'
    } = options;

    return (...args) => {
      if (!checkAndRedirect({ showMessage, redirectPath, message })) {
        return;
      }
      
      return callback(...args);
    };
  }, [checkAndRedirect]);

  // Check if specific feature can be accessed
  const canAccessFeature = useCallback((featureName) => {
    if (!canAccessManagement()) {
      console.warn(`Access denied to ${featureName}: Profile incomplete`);
      return false;
    }
    return true;
  }, [canAccessManagement]);

  // Get profile completion progress data
  const getProgressData = useCallback(() => {
    const missingFields = getMissingFields();
    const totalFields = 8; // Total required fields for vendor profile
    const completedFields = totalFields - missingFields.length;
    
    return {
      completed: completedFields,
      total: totalFields,
      percentage: profileCompleteness,
      missing: missingFields,
      isComplete: isProfileComplete()
    };
  }, [getMissingFields, profileCompleteness, isProfileComplete]);

  // Auto-check on mount (optional)
  useEffect(() => {
    if (isLoggedIn && role === 'vendor' && !isLoading) {
      // Show warning if profile is incomplete
      if (!isProfileComplete()) {
        // Only show warning on certain routes or after delay
        const timer = setTimeout(() => {
          showCompletenessWarning();
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isLoggedIn, role, isLoading, isProfileComplete, showCompletenessWarning]);

  return {
    // State
    profileCompleteness,
    isLoading,
    isProfileComplete,
    canAccessManagement,
    
    // Actions
    checkAndRedirect,
    showCompletenessWarning,
    updateProfileCompleteness,
    
    // Utilities
    getProfileStatus,
    getProgressData,
    getMissingFields,
    protectFunction,
    canAccessFeature,
    
    // Role info
    role,
    isLoggedIn
  };
};

export default useProfileCompleteness;
