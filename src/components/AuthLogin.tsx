"use client";
import { InputComponent } from "@/components/admin/form";
import { loginWithUser } from "@/services/UserService";
import { ICurrentUserContext } from "@/utils/context";
import useCurrentUser from "@/utils/useCurrentUser";
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";
import Loader from "./Loader";
import Link from "next/link";

const AuthLogin = () => {
  const { setUserInfo } = useCurrentUser() as ICurrentUserContext;
  const router = useRouter();
  const [status, setStatus] = useState<string>();
  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string().email().required("И-мэйл оруулна уу."),
    password: Yup.string().min(3).max(8).required("Нууц үг оруулна уу."),
  });

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      const response = await loginWithUser(values?.email, values?.password);
      if (response.status) {
        localStorage.setItem("lastname", response.user?.lastname);
        localStorage.setItem("firstname", response.user?.firstname);
        localStorage.setItem("user_level", response.user?.user_level);
        localStorage.setItem("email", response.user?.email);
        localStorage.setItem(
          "roles",
          JSON.stringify(response.user?.roles) || null
        );
        localStorage.setItem("org_id", response.user?.org_id);
        localStorage.setItem("user_id", response.user?.id);
        localStorage.setItem("org_name", response.user?.organization?.name);

        setUserInfo(response.user);

        router.push("/admin/dashboard");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.log({ error });
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

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
              <div className="flex flex-col w-full gap-2 py-2">
                <Box
                  sx={{
                    padding: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <FormLabel className=" text-text-body-medium text-black">
                    Нэвтрэх нэр
                  </FormLabel>
                  <InputComponent
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
                    padding: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <FormLabel className=" text-text-body-medium text-black">
                    Нууц үг
                  </FormLabel>
                  <Box className="relative">
                    <InputComponent
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
                          color="#005baa"
                          onClick={() => setShow(!show)}
                          className="cursor-pointer"
                        />
                      ) : (
                        <EyeOffFillIcon
                          size={18}
                          color="#005baa"
                          onClick={() => setShow(!show)}
                          className="cursor-pointer"
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
                <Box
                  sx={{
                    padding: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <Button
                    className=" bg-primary-medium hover:bg-opacity-100"
                    variant="contained"
                    color="info"
                    type="submit"
                    size="medium"
                  >
                    Нэвтрэх
                  </Button>
                </Box>
              </div>
              <Link href="/login/forgot-password">
                <Typography className=" text-text-body-medium text-black">
                  Нууц үг мартсан?
                </Typography>
              </Link>
              <Link href="/request-access" className="mt-4">
                <Typography className=" text-text-body-medium text-primary-main font-semibold">
                  Байгууллагаар бүртгүүлэх
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
