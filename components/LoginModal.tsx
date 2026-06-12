"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { useAuthModal } from "@/stores/useAuthModal";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const LoginModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const openRegister = useAuthModal((s) => s.openRegister);

  if (!isOpen) return null;

  
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const response = await axios.post("/api/login", {
        username,
        password,
      });

      const token = response.data.token;

      localStorage.setItem("match_prediction_token", token);

      toast.success("Login successful");

      onClose();

      window.location.reload();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md bg-[#1e1f23] rounded-xl p-6 text-white shadow-xl relative">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Login</h2>

          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Username */}
        <div className="mb-4">
          <label className="text-sm text-gray-300 mb-1 block">
            Username / Mobile No.
          </label>

          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-transparent border border-gray-600 rounded-lg px-3 py-2 outline-none focus:border-cyan-400"
          />
        </div>

        {/* Password */}
        <div className="mb-2">
          <label className="text-sm text-gray-300 mb-1 block">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border border-gray-600 rounded-lg px-3 py-2 pr-10 outline-none focus:border-cyan-400"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-gray-400"
            >
              👁️
            </button>
          </div>
        </div>

        {/* Forgot */}
        <div className="text-right mb-4 text-sm">
          <Dialog>
            <DialogTrigger>
              <button className="cursor-pointer text-gray-400 hover:text-cyan-400">
                Forgot Username or Password?
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Please reset at new8myr.com</DialogTitle>
              </DialogHeader>
              <a
                href="https://new8myr.com/en-my"
                className="mt-4 inline-flex w-full justify-center rounded-lg bg-cyan-500 px-4 py-2 text-black font-semibold hover:bg-cyan-400"
              >
                Go to Reset Page
              </a>
            </DialogContent>
          </Dialog>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-cyan-400 text-black font-semibold hover:bg-cyan-300 transition mb-4 disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Loading..." : "Submit"}
        </button>

        {/* Footer */}
        <div className="text-center text-sm text-gray-400">
          No account yet?{" "}

          <button
            onClick={openRegister}
            className="text-cyan-400 hover:underline cursor-pointer"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
