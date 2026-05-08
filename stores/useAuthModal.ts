// /stores/useAuthModal.ts
import { create } from "zustand";

type ModalType = "login" | "register" | null;

type AuthModalState = {
  type: ModalType;
  openLogin: () => void;
  openRegister: () => void;
  close: () => void;
};

export const useAuthModal = create<AuthModalState>((set) => ({
  type: null,
  openLogin: () => set({ type: "login" }),
  openRegister: () => set({ type: "register" }),
  close: () => set({ type: null }),
}));