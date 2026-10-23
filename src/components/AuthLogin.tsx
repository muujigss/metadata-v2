"use client";
import { InputComponent } from "@/components/admin/form";
import { loginWithUser } from "@/services/UserService";
import {
  Alert,
  Box,
  Button,
  Divider,
  FormLabel,
  Typography,
} from "@mui/material";
import EyeFillIcon from "remixicon-react/EyeLineIcon";
import EyeOffFillIcon from "remixicon-react/EyeOffLineIcon";
import { Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import Link from "next/link";

const AuthLogin = () => {
  const [status, setStatus] = useState<string>();
  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string().email().required("И-мэйл оруулна уу."),
    password: Yup.string().required("Нууц үг оруулна уу."),
  });

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      setStatus(undefined);
      const response = await loginWithUser(values?.email, values?.password);
      if (response.status && response.user) {
        const destination = ({
          1: "/admin/org-request",
          2: "/admin/user",
          3: "/admin/database",
        } as Record<number, string>)[Number(response.user.user_level)];
        if (!destination) throw new Error("Unsupported user level");
        localStorage.setItem("lastname", response.user?.lastname);
        localStorage.setItem("firstname", response.user?.firstname);
        localStorage.setItem("user_level", response.user?.user_level);
        localStorage.setItem("email", response.user?.email);
        localStorage.setItem(
          "roles",
          JSON.stringify(response.user?.roles || null)
        );
        localStorage.setItem("org_id", response.user?.org_id);
        localStorage.setItem("user_id", response.user?.id);
        localStorage.setItem("org_name", response.user?.organization?.name);

        // Load the protected document with the newly saved session cookies.
        // Keep the pending state until navigation replaces this page.
        window.location.replace(destination);
      } else {
        setStatus("error");
        setLoading(false);
      }
    } catch (error) {
      console.log({ error });
      setStatus("error");
      setLoading(false);
    }
  };

  return (
    <>
      <Divider className="w-full" />
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ handleSubmit, values, setFieldValue, errors }) => {
          return (
            <Form
              className="w-full flex flex-col items-center"
              onSubmit={handleSubmit}
            >
              {status == "error" && (
                <Alert severity="error">
                  Хэрэглэгчийн нэр эсвэл нууц үг буруу байна ...
                </Alert>
              )}
              <div className="flex flex-col w-full gap-1 py-1">
                <Box
                  sx={{
                    padding: { xs: 0.5, sm: 1 },
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <FormLabel className="text-text-body-medium !text-white">
                    Нэвтрэх нэр
                  </FormLabel>
                  <InputComponent
                    className="login-input"
                    type="text"
                    name="email"
                    label=""
                    value={values.email}
                    onChange={(e: any) => {
                      setFieldValue("email", e.target.value);
                    }}
                    errors={errors?.email}
                  />
                </Box>
                <Box
                  sx={{
                    padding: { xs: 0.5, sm: 1 },
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <FormLabel className="text-text-body-medium !text-white">
                    Нууц үг
                  </FormLabel>
                  <Box className="relative">
                    <InputComponent
                      className="login-input"
                      type={show ? "text" : "password"}
                      name="password"
                      label=""
                      value={values.password}
                      onChange={(e: any) => {
                        setFieldValue("password", e.target.value);
                      }}
                      errors={errors?.password}
                    />
                    <Box className=" absolute right-2 z-20 top-3">
                      {show ? (
                        <EyeFillIcon
                          size={18}
                          color="#60A5FA"
                          onClick={() => setShow(!show)}
                          className="cursor-pointer"
                        />
                      ) : (
                        <EyeOffFillIcon
                          size={18}
                          color="#60A5FA"
                          onClick={() => setShow(!show)}
                          className="cursor-pointer"
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
                <Box
                  sx={{
                    padding: { xs: 0.5, sm: 1 },
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <Button
                    variant="contained"
                    color="info"
                    type="submit"
                    disabled={loading}
                    size="medium"
                    sx={{
                      backgroundColor: "#080812",
                      color: "white",
                      py: 1.5,
                      "&:hover": {
                        backgroundColor: "#1a1a1f",
                      },
                      border: 1,
                      borderColor: "#6b7280",
                      borderRadius: "8px",
                    }}
                  >
                    {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
                  </Button>
                </Box>
              </div>
              <Link href="/login/forgot-password">
                <Typography className="text-text-body-medium text-gray-400 hover:text-white transition-colors">
                  Нууц үг мартсан?
                </Typography>
              </Link>
              <Link href="/request-access" className="mt-2 sm:mt-4">
                <Typography className="text-text-body-medium text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                  Байгууллагаар бүртгүүлэх хүсэлт
                </Typography>
              </Link>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default AuthLogin;
