"use client";
import { useRef, useState } from "react";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Typography } from "@mui/material";

export default function ResetPasswordButton({ userId, email }: { userId: number; email: string }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const [message, setMessage] = useState<{ severity: "success" | "error"; text: string } | null>(null);
  const reset = async () => {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    try {
      const response = await fetch("/api/admin/users/reset-password", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Нууц үг шинэчилж чадсангүй.");
      setOpen(false);
      setMessage({ severity: "success", text: `Нууц үг шинэчлэгдлээ. Нэвтрэх нэр: ${result.email || email}. Түр нууц үг: 12345678` });
    } catch (error) {
      setMessage({ severity: "error", text: error instanceof Error ? error.message : "Холболтын алдаа гарлаа." });
    } finally { pending.current = false; setBusy(false); }
  };
  return <>
    <Button size="small" variant="outlined" onClick={() => setOpen(true)}>Нууц үг шинэчлэх</Button>
    <Dialog open={open} onClose={() => { if (!busy) setOpen(false); }} maxWidth="xs" fullWidth>
      <DialogTitle>Нууц үг шинэчлэх</DialogTitle>
      <DialogContent>
        <Typography sx={{ overflowWrap: "anywhere" }}>{email}</Typography>
        <Typography sx={{ mt: 2 }}>Энэ хэрэглэгчийн нууц үгийг 12345678 болгож шинэчлэх үү? Хуучин нууц үг ажиллахгүй болно. Мэйл илгээхгүй.</Typography>
      </DialogContent>
      <DialogActions>
        <Button disabled={busy} onClick={() => setOpen(false)}>Болих</Button>
        <Button disabled={busy} variant="contained" onClick={reset}>{busy ? "Шинэчилж байна…" : "Шинэчлэх"}</Button>
      </DialogActions>
    </Dialog>
    <Snackbar open={!!message} onClose={() => setMessage(null)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
      <Alert severity={message?.severity} onClose={() => setMessage(null)} sx={{ width: "100%" }}>{message?.text}</Alert>
    </Snackbar>
  </>;
}
