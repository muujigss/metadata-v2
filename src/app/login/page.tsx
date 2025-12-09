"use client";

import AuthLogin from "@/components/AuthLogin";
import OrgLogoWall from "@/components/organization/OrgLogoWall";
import { Divider, Typography } from "@mui/material";

const LoginPage = () => {
  return (
    <div className="flex w-full min-h-screen items-center justify-center overflow-hidden relative">
      <div className="w-full max-w-md p-8 rounded-2xl bg-[#3D4E6C33] backdrop-blur-sm shadow-xl border border-gray-700 z-10">
        <Typography className="uppercase text-text-title-medium mb-6 font-bold text-center text-white">
          Системд Нэвтрэх
        </Typography>
        <Divider className="w-full mb-6 bg-gray-600" />
        <AuthLogin />
      </div>
    </div>
  );
};

export default LoginPage;