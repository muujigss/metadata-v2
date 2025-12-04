"use client";

import AuthLogin from "@/components/AuthLogin";
import ThreeDModel from "@/components/ThreeDModel";
import { Divider, Typography } from "@mui/material";

const LoginPage = () => {
  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen overflow-hidden">
      {/* Left Side - Login Form */}
      <div className="flex flex-col items-center justify-start w-full lg:w-2/5 p-8 lg:p-16 pt-64 relative z-10">
        <div className="w-full max-w-md p-8 rounded-2xl bg-[#1F2937]/80 backdrop-blur-sm shadow-xl border border-gray-700">
          <Typography className="uppercase text-text-title-medium mb-6 font-bold text-center text-white">
            Системд Нэвтрэх
          </Typography>
          <Divider className="w-full mb-6 bg-gray-600" />
          <AuthLogin />
        </div>
      </div>

      {/* Right Side - 3D Animation */}
      <div className="hidden lg:flex w-full lg:w-3/5 items-start justify-center pt-24 relative">
        <ThreeDModel />
      </div>
    </div>
  );
};

export default LoginPage;