"use client";
import { InputComponent } from "@/components/admin/form";
import { changePasswordService, loginWithUser } from "@/services/UserService";
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
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import EyeFillIcon from "remixicon-react/EyeLineIcon";
import EyeOffFillIcon from "remixicon-react/EyeOffLineIcon";
import * as Yup from "yup";
import Loader from "./Loader";

const ChangePassword = () => {
  const { setUserInfo, userInfo } = useCurrentUser() as ICurrentUserContext;
  const router = useRouter();
  const [status, setStatus] = useState<string>();
  const [alertMessage, setAlertMessage] = useState<string>();
  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    oldPassword: Yup.string()
      .min(3)
      .max(10)
      .required("Хуучин Нууц үг оруулна уу."),
    newPassword: Yup.string()
      .min(3)
      .max(10)
      .required("Шинэ Нууц үг оруулна уу."),
    confirmPassword: Yup.string()
      .min(3)
      .max(10)
      .required("Шинэ нууц үгээ давтан оруулна уу."),
  });

  const onSubmit = async (values: any) => {
    try {
      if (values?.newPassword != values?.confirmPassword) {
        setStatus("error");
        setAlertMessage("Нууц үг таарахгүй байна.");
        return;
      }
      setLoading(true);
      const response = await changePasswordService({
        id: userInfo?.id,
        oldPassword: values?.oldPassword,
        newPassword: values?.newPassword,
      });
      if (response.status) {
        setStatus("success");
        setAlertMessage("Нууц үг амжилттай солигдлоо.");
      } else {
        setStatus("error");
        setAlertMessage(response.message);
        return;
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
      <Typography className="uppercase text-text-title-medium mb-2 font-light">
        Нууц үг солих
      </Typography>
      <Divider className="w-full" />

      {status == "error" && <Alert severity="error">{alertMessage}</Alert>}
      {status == "success" && <Alert severity="success">{alertMessage}</Alert>}

      <Formik
        initialValues={{
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ handleSubmit, values, setFieldValue, errors }) => {
          return (
            <Form
              className="w-full flex flex-col items-center"
              onSubmit={handleSubmit}
            >
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
                    Хуучин нууц үг
                  </FormLabel>
                  <InputComponent
                    type="text"
                    name="oldPassword"
                    label=""
                    value={values.oldPassword}
                    onChange={(e: any) => {
                      setFieldValue("oldPassword", e.target.value);
                    }}
                    errors={errors?.oldPassword}
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
                    Шинэ нууц үг
                  </FormLabel>
                  <Box className="relative">
                    <InputComponent
                      type={show ? "text" : "password"}
                      name="newPassword"
                      label=""
                      value={values.newPassword}
                      onChange={(e: any) => {
                        setFieldValue("newPassword", e.target.value);
                      }}
                      errors={errors?.newPassword}
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
                  <FormLabel className=" text-text-body-medium text-black">
                    Шинэ нууц үг давтах
                  </FormLabel>
                  <Box className="relative">
                    <InputComponent
                      type={show ? "text" : "password"}
                      name="confirmPassword"
                      label=""
                      value={values.confirmPassword}
                      onChange={(e: any) => {
                        setFieldValue("confirmPassword", e.target.value);
                      }}
                      errors={errors?.confirmPassword}
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
                    Хадгалах
                  </Button>
                </Box>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default ChangePassword;
