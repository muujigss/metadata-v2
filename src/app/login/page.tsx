"use client";

import AuthLogin from "@/components/AuthLogin";
import { Divider, Paper, Typography, IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";

const LoginPage = () => {
  const router = useRouter();

  return (
    <Paper
      elevation={0}
      className="flex flex-col items-center justify-center p-4 border my-8 outline outline-0 outline-gray-100 relative"
    >
      <IconButton
        className="absolute bottom-4 left-4"
        onClick={() => router.push("/")}
      >
        <HomeIcon />
      </IconButton>
      <Typography className="uppercase text-text-title-medium mb-2 font-light">
        Системд Нэвтрэх
      </Typography>
      <Divider className="w-full mb-4" />
      <AuthLogin />
    </Paper>
  );
};

export default LoginPage;