import AdminBreadCrumpMenu from "@/components/admin/AdminBreadCrumpMenu";
import ChangePassword from "@/components/ChangePassword";
import { Box } from "@mui/material";
import React from "react";

const ChangePasswordPage = () => {
  return (
    <Box width={"100%"}>
      <Box sx={{ p: 2 }}>
        <AdminBreadCrumpMenu
          type="settings"
          submenu_name="Тохиргоо"
          link="/admin/user/change-password"
        />
      </Box>
      <Box width={"40%"}>
        <ChangePassword />
      </Box>
    </Box>
  );
};

export default ChangePasswordPage;
