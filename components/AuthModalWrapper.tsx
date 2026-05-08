"use client";

import { useAuthModal } from "@/stores/useAuthModal";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

const AuthModalWrapper = () => {
  const { type, close } = useAuthModal();

  return (
    <>
      <LoginModal isOpen={type === "login"} onClose={close} />
      <RegisterModal isOpen={type === "register"} onClose={close} />
    </>
  );
};

export default AuthModalWrapper;