import { create } from "zustand";

interface AuthUIState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
  clearMessages: () => void;
}

export const useAuthStore = create<AuthUIState>((set) => ({
  isLoading: false,
  error: null,
  success: null,
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, success: null }),
  setSuccess: (success) => set({ success, error: null }),
  clearMessages: () => set({ error: null, success: null }),
}));
