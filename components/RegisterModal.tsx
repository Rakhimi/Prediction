"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { useAuthModal } from "@/stores/useAuthModal";
import { Input } from "./ui/input";
import toast from "react-hot-toast";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const RegisterModal: React.FC<Props> = ({
  isOpen,
  onClose,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [currencyOpen, setCurrencyOpen] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [sendingTac, setSendingTac] =
    useState(false);

  const [countdown, setCountdown] = useState(0);

  const [error, setError] = useState("");

  const openLogin = useAuthModal(
    (s) => s.openLogin
  );

  const currencies = [
    { code: "TH", label: "THB" },
    { code: "MY", label: "MYR" },
    { code: "VN", label: "VND" },
    { code: "ID", label: "IDR" },
    { code: "BD", label: "BDT" },
    { code: "AU", label: "AUD" },
    { code: "PK", label: "PKR" },
    { code: "PG", label: "PGK" },
  ];

  const [selectedCurrency, setSelectedCurrency] =
    useState(currencies[1]);

  const [form, setForm] = useState({
    currency: "MYR",

    username: "",
    password: "",
    confirmPassword: "",

    firstName: "",

    mobileno: "",

    mobileTac: "",

    refCode: "",
  });

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      currency: "MYR",

      username: "",
      password: "",
      confirmPassword: "",

      firstName: "",

      mobileno: "",

      mobileTac: "",

      refCode: "",
    });

    setError("");
  };

  const handleSendTac = async () => {
    setError("");

    if (!form.mobileno) {
      setError("Please enter mobile number");
      return;
    }

    const cleanedMobile = form.mobileno.replace(
      /\D/g,
      ""
    );

    if (
      cleanedMobile.length < 9 ||
      cleanedMobile.length > 10
    ) {
      setError("Invalid mobile number");
      return;
    }

    try {
      setSendingTac(true);

      const fullPhone = `60${cleanedMobile}`;

      const res = await fetch("/api/request-register-tac", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: fullPhone,
          uid: form.username,
        }),
      });

      const text = await res.text();

      const data = JSON.parse(text);

      if (!res.ok || data.status === false) {
        toast.error(data.msg || "Failed to send TAC");
      }

      setCountdown(120);

      toast.success("OTP/TAC sent successfully");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSendingTac(false);
    }
  };

  const handleSubmit = async () => {
    setError("");

    if (
      !form.username ||
      !form.password ||
      !form.confirmPassword ||
      !form.mobileno ||
      !form.mobileTac ||
      !form.firstName
    ) {
      setError("Please fill all required fields");
      return;
    }

    if (
      form.username.length < 6 ||
      form.username.length > 18
    ) {
      setError(
        "Username must be between 6 and 18 characters"
      );
      return;
    }

    if (form.password.length < 8) {
      setError(
        "Password must be at least 8 characters"
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const cleanedMobile = form.mobileno.replace(
        /\D/g,
        ""
      );

      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          ...form,

          mobileno: cleanedMobile,

          countryCode: 60,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Register failed");
      }

      toast.success("Account created successfully!");

      resetForm();

      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#1e1f23] rounded-xl p-6 relative text-white shadow-xl">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">
            Create Account
          </h2>

          <button
            className="cursor-pointer"
            onClick={() => {
              resetForm();
              onClose();
            }}
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* CURRENCY */}
        <div className="mb-4 relative">
          <label className="text-sm text-gray-300 mb-1 block">
            Currency
          </label>

          <button
            type="button"
            onClick={() =>
              setCurrencyOpen(!currencyOpen)
            }
            className="w-full flex items-center justify-between border border-gray-600 rounded-lg px-3 py-2 hover:border-cyan-400"
          >
            <div className="flex items-center gap-2">
              <span>{selectedCurrency.code}</span>
              <span>{selectedCurrency.label}</span>
            </div>

            <span
              className={`transition ${
                currencyOpen ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>

          {currencyOpen && (
            <div className="absolute z-50 mt-2 w-full bg-[#1e1f23] border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {currencies.map((cur) => (
                <button
                  key={cur.label}
                  type="button"
                  onClick={() => {
                    setSelectedCurrency(cur);

                    setCurrencyOpen(false);

                    setForm((prev) => ({
                      ...prev,
                      currency: cur.label,
                    }));
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-white/5 flex justify-between"
                >
                  <span>{cur.code}</span>

                  <span className="text-gray-400">
                    {cur.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* FULL NAME */}
        <div className="mb-4">
          <label className="text-sm text-gray-300 mb-1 block">
            Full Name
          </label>

          <Input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="Enter Full Name"
          />
        </div>

        {/* USERNAME */}
        <div className="mb-4">
          <label className="text-sm text-gray-300 mb-1 block">
            Username
          </label>

          <Input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter Username"
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-4">
          <label className="text-sm text-gray-300 mb-1 block">
            Password
          </label>

          <div className="relative">
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
            >
              👁️
            </button>
          </div>
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="mb-4">
          <label className="text-sm text-gray-300 mb-1 block">
            Confirm Password
          </label>

          <div className="relative">
            <Input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={handleChange}
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
            >
              👁️
            </button>
          </div>
        </div>

        {/* MOBILE */}
        <div className="mb-4">
          <label className="text-sm text-gray-300 mb-1 block">
            Mobile No
          </label>

          <div className="flex gap-2">
            <div className="flex items-center gap-2 border border-gray-600 rounded-lg px-3 py-1">
              <span>🇲🇾</span>
              <span>+60</span>
            </div>

            <div className="flex flex-1 gap-2">
              <Input
                name="mobileno"
                value={form.mobileno}
                onChange={handleChange}
                placeholder="141234567"
              />

              <Button
                type="button"
                disabled={
                  sendingTac || countdown > 0
                }
                onClick={handleSendTac}
                className="min-w-[90px] cursor-pointer"
              >
                {sendingTac
                  ? "Sending..."
                  : countdown > 0
                  ? `${countdown}s`
                  : "Send"}
              </Button>
            </div>
          </div>
        </div>

        {/* OTP */}
        <div className="mb-4">
          <label className="text-sm text-gray-300 mb-1 block">
            Mobile OTP Code
          </label>

          <Input
            name="mobileTac"
            value={form.mobileTac}
            onChange={handleChange}
            placeholder="Enter OTP"
          />
        </div>

        {/* REFERRAL */}
        <div className="mb-6">
          <label className="text-sm text-gray-300 mb-1 block">
            Referral Code
          </label>

          <Input
            name="refCode"
            value={form.refCode}
            onChange={handleChange}
          />
        </div>

        {/* ERROR */}
        {error && (
          <p className="text-red-400 text-sm mb-3">
            {error}
          </p>
        )}

        {/* SUBMIT */}
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-cyan-400 text-black font-semibold cursor-pointer"
        >
          {loading
            ? "Registering..."
            : "Register"}
        </Button>

        <div className="text-center text-sm text-gray-400 mt-4">
          Already have account?{" "}
          <button
            onClick={openLogin}
            className="text-cyan-400 hover:underline cursor-pointer"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;