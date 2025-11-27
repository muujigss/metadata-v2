"use client";
import { InputComponent } from "@/components/admin/form";
import { forgotPasswordService } from "@/services/UserService";
import { ICurrentUserContext } from "@/utils/context";
import useCurrentUser from "@/utils/useCurrentUser";
import { Alert, Box, Button, Divider, FormLabel } from "@mui/material";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";
import Loader from "./Loader";

const ForgotPassword = () => {
  const { setUserInfo } = useCurrentUser() as ICurrentUserContext;
  const router = useRouter();
  const [status, setStatus] = useState<string>();
  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string().email().required("И-мэйл оруулна уу."),
  });

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      const response = await forgotPasswordService(values?.email);

      if (response.status) {
        setStatus("Та и-мэйл хаягаа шалгана уу.");
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
      {status && status?.length > 0 && <Alert severity="error">{status}</Alert>}

      <Formik
        initialValues={{ email: "" }}
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
                    И-мэйл хаяг
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
                  <Button
                    className=" bg-primary-medium hover:bg-opacity-100"
                    variant="contained"
                    color="info"
                    type="submit"
                    size="medium"
                  >
                    Илгээх
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

export default ForgotPassword;
