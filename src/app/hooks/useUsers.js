import { useEffect } from 'react';
import { useUserStore } from '../store/userStore';

/**
 * Custom Hook to manage all user operations.
 * Separates UI controllers from store state.
 */
export const useUsers = () => {
  const {
    users,
    loading,
    error,
    fetchUsers,
    updateUser,
    deleteUser
  } = useUserStore();

  // Proactively fetch users on mount to ensure views are populated
  useEffect(() => {
    if (users.length === 0) {
      fetchUsers();
    }
  }, [users.length, fetchUsers]);

  return {
    users,
    loading,
    error,
    refetchUsers: fetchUsers,
    updateUser,
    deleteUser
  };
};
