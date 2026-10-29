"use client";
import { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import ChangePassword from "@/components/ChangePassword";

export default function PasswordChangePrompt() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("password-change-suggested") === "true") {
      setOpen(true);
      sessionStorage.removeItem("password-change-suggested");
    }
  }, []);
  return <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
    <DialogTitle>Шинэ нууц үг үүсгэх</DialogTitle>
    <DialogContent>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Та түр нууц үгээр нэвтэрсэн байна. Өөрийн шинэ нууц үгийг тохируулна уу. Хүсвэл энэ цонхыг хааж, дараа солих боломжтой.
      </Typography>
      <ChangePassword initialOldPassword="12345678" />
    </DialogContent>
    <DialogActions><Button onClick={() => setOpen(false)}>Хаах / Дараа</Button></DialogActions>
  </Dialog>;
}
