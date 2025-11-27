import ForgotPassword from "@/components/ForgotPassword";
import { Divider, Paper, Typography } from "@mui/material";

const ForgotPasswordPage = () => {
  return (
    <Paper
      elevation={0}
      className="flex flex-col items-center justify-center  p-4 border my-8 outline outline-0 outline-gray-100"
    >
      <Typography className="uppercase text-text-title-medium mb-2 font-light">
        Нууц үг мартсан?
      </Typography>
      <Divider className="w-full" />
      <ForgotPassword />
    </Paper>
  );
};

export default ForgotPasswordPage;
