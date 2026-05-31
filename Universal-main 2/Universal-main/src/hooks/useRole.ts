import { useAuth } from '../context/AuthContext';

export const useRole = () => {
  const { profile } = useAuth();

  const role = profile?.role || 'USER';

  const normalizedRole = role.toUpperCase();

  return {
    role,
    isAdmin: normalizedRole === 'ADMIN',
    isStudent: normalizedRole === 'USER' || normalizedRole === 'STUDENT',
    isCadet: normalizedRole === 'USER' || normalizedRole === 'STUDENT',
  };
};
