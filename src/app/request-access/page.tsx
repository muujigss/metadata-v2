"use client";

import { InputComponent } from "@/components/admin/form";
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  FormLabel,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";
import HomeIcon from "@mui/icons-material/Home";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import LogoPics from "@/components/layout/LogoPics";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const RequestAccessPage = () => {
  const router = useRouter();
  const [status, setStatus] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string>("");

  const validationSchema = Yup.object({
    // Organization
    org_name: Yup.string().required("Байгууллагын нэр оруулна уу."),
    org_email: Yup.string()
      .email("Зөв и-мэйл хаяг оруулна уу.")
      .required("Байгууллагын и-мэйл оруулна уу."),
    org_phone: Yup.string().required("Байгууллагын утас оруулна уу."),
    
    // User
    lastname: Yup.string().required("Овог оруулна уу."),
    firstname: Yup.string().required("Нэр оруулна уу."),
    user_email: Yup.string()
      .email("Зөв и-мэйл хаяг оруулна уу.")
      .required("Хэрэглэгчийн и-мэйл оруулна уу."),
    
    // File
    file: Yup.mixed().required("Байгууллагын лого оруулна уу."),
  });

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      setStatus("");
      setMessage("");

      const formData = new FormData();
      // Append all text fields
      Object.keys(values).forEach((key) => {
        if (key !== "file") {
          formData.append(key, values[key]);
        }
      });
      // Append file
      formData.append("file", values.file);

      const response = await fetch("/api/request-access", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Таны хүсэлтийг хүлээн авлаа. Бид шалгаад хариу мэдэгдэх болно.");
        // Optional: redirect after some time
        setTimeout(() => {
            router.push("/login");
        }, 3000);
      } else {
        setStatus("error");
        setMessage(data.message || "Алдаа гарлаа. Дахин оролдоно уу.");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("Сүлжээний алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#080812] overflow-auto top-glow">
      <div className="absolute inset-0 -top-[220px] bg-[url('/v2/bg-pattern.png')] bg-cover bg-no-repeat z-0"></div>
      
      <div className="relative z-10">
        {/* Logo and Title Section */}
        <div className="m-6 flex justify-center">
          <LogoPics />
        </div>
        <div className="flex flex-wrap items-center container mx-auto justify-center self-stretch mb-6">
          <div className="flex flex-col items-start justify-between gap-4 w-auto">
            <h1 className="uppercase text-text-title-large bg-gradient-to-t from-primary-default to-tertirary-high bg-clip-text text-transparent">
              Төрийн мета өгөгдлийн нэгдсэн сан
            </h1>
          </div>
        </div>

        {/* Form Section */}
        <div className="py-8">
        <Container maxWidth="md">
          <Paper elevation={0} className="p-8 border-none !bg-[#3D4E6C33] !text-white backdrop-blur-sm shadow-xl border border-gray-700 relative">
        <IconButton
          className="absolute top-4 left-4 text-white hover:bg-white/10"
          onClick={() => router.push("/login")}
        >
          <HomeIcon />
        </IconButton>
        
        <Typography className="uppercase text-text-title-medium mb-6 font-light text-center mt-8 text-white">
          Байгууллагаар бүртгүүлэх хүсэлт
        </Typography>
        
        <Divider className="w-full mb-8" />

        {status === "success" ? (
          <Alert severity="success" className="mb-4">
            {message}
          </Alert>
        ) : (
          <Formik
            initialValues={{
              org_name: "",
              org_short_name: "",
              org_email: "",
              org_phone: "",
              org_address: "",
              org_website: "",
              lastname: "",
              firstname: "",
              user_email: "",
              user_phone: "",
              department: "",
              position: "",
              file: null,
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ handleSubmit, values, setFieldValue, errors, touched }) => (
              <Form onSubmit={handleSubmit}>
                {status === "error" && (
                  <Alert severity="error" className="mb-4">
                    {message}
                  </Alert>
                )}

                <Typography variant="h6" className="mb-4 text-white">
                  Байгууллагын мэдээлэл
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box className="flex flex-col gap-1">
                      <FormLabel className="text-text-body-medium text-gray-300">
                        Байгууллагын нэр <span className="text-red-500">*</span>
                      </FormLabel>
                      <InputComponent className="dark-input"
                        type="text"
                        name="org_name"
                        label="Байгууллагын нэр"
                        value={values.org_name}
                        onChange={(e: any) => setFieldValue("org_name", e.target.value)}
                        errors={touched.org_name && errors.org_name}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box className="flex flex-col gap-1">
                      <FormLabel className="text-text-body-medium text-gray-300">
                        Товч нэр
                      </FormLabel>
                      <InputComponent className="dark-input"
                        type="text"
                        name="org_short_name"
                        label="Товч нэр"
                        value={values.org_short_name}
                        onChange={(e: any) => setFieldValue("org_short_name", e.target.value)}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box className="flex flex-col gap-1">
                      <FormLabel className="text-text-body-medium text-gray-300">
                        И-мэйл <span className="text-red-500">*</span>
                      </FormLabel>
                      <InputComponent className="dark-input"
                        type="email"
                        name="org_email"
                        label="И-мэйл"
                        value={values.org_email}
                        onChange={(e: any) => setFieldValue("org_email", e.target.value)}
                        errors={touched.org_email && errors.org_email}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box className="flex flex-col gap-1">
                      <FormLabel className="text-text-body-medium text-gray-300">
                        Утас <span className="text-red-500">*</span>
                      </FormLabel>
                      <InputComponent className="dark-input"
                        type="text"
                        name="org_phone"
                        label="Утас"
                        value={values.org_phone}
                        onChange={(e: any) => setFieldValue("org_phone", e.target.value)}
                        errors={touched.org_phone && errors.org_phone}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box className="flex flex-col gap-1">
                      <FormLabel className="text-text-body-medium text-gray-300">
                        Хаяг
                      </FormLabel>
                      <InputComponent className="dark-input"
                        type="text"
                        name="org_address"
                        label="Хаяг"
                        value={values.org_address}
                        onChange={(e: any) => setFieldValue("org_address", e.target.value)}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box className="flex flex-col gap-1">
                      <FormLabel className="text-text-body-medium text-gray-300">
                        Вэб сайт
                      </FormLabel>
                      <InputComponent className="dark-input"
                        type="text"
                        name="org_website"
                        label="Вэб сайт"
                        value={values.org_website}
                        onChange={(e: any) => setFieldValue("org_website", e.target.value)}
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Divider className="my-6" />

                <Typography variant="h6" className="mb-4 text-white">
                  Админ хэрэглэгчийн мэдээлэл
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box className="flex flex-col gap-1">
                      <FormLabel className="text-text-body-medium text-gray-300">
                        Овог <span className="text-red-500">*</span>
                      </FormLabel>
                      <InputComponent className="dark-input"
                        type="text"
                        name="lastname"
                        label="Овог"
                        value={values.lastname}
                        onChange={(e: any) => setFieldValue("lastname", e.target.value)}
                        errors={touched.lastname && errors.lastname}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box className="flex flex-col gap-1">
                      <FormLabel className="text-text-body-medium text-gray-300">
                        Нэр <span className="text-red-500">*</span>
                      </FormLabel>
                      <InputComponent className="dark-input"
                        type="text"
                        name="firstname"
                        label="Нэр"
                        value={values.firstname}
                        onChange={(e: any) => setFieldValue("firstname", e.target.value)}
                        errors={touched.firstname && errors.firstname}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box className="flex flex-col gap-1">
                      <FormLabel className="text-text-body-medium text-gray-300">
                        И-мэйл <span className="text-red-500">*</span>
                      </FormLabel>
                      <InputComponent className="dark-input"
                        type="email"
                        name="user_email"
                        label="И-мэйл"
                        value={values.user_email}
                        onChange={(e: any) => setFieldValue("user_email", e.target.value)}
                        errors={touched.user_email && errors.user_email}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box className="flex flex-col gap-1">
                      <FormLabel className="text-text-body-medium text-gray-300">
                        Утас
                      </FormLabel>
                      <InputComponent className="dark-input"
                        type="text"
                        name="user_phone"
                        label="Утас"
                        value={values.user_phone}
                        onChange={(e: any) => setFieldValue("user_phone", e.target.value)}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box className="flex flex-col gap-1">
                      <FormLabel className="text-text-body-medium text-gray-300">
                        Хэлтэс
                      </FormLabel>
                      <InputComponent className="dark-input"
                        type="text"
                        name="department"
                        label="Хэлтэс"
                        value={values.department}
                        onChange={(e: any) => setFieldValue("department", e.target.value)}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box className="flex flex-col gap-1">
                      <FormLabel className="text-text-body-medium text-gray-300">
                        Албан тушаал
                      </FormLabel>
                      <InputComponent className="dark-input"
                        type="text"
                        name="position"
                        label="Албан тушаал"
                        value={values.position}
                        onChange={(e: any) => setFieldValue("position", e.target.value)}
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Divider className="my-6" />

                <Typography variant="h6" className="mb-4 text-white">
                  Байгууллагын лого
                </Typography>

                <Box className="flex flex-col gap-2">
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    className="w-fit"
                  >
                    Лого хуулах
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/png, image/jpeg"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          setFieldValue("file", file);
                          setFileName(file.name);
                        }
                      }}
                    />
                  </Button>
                  {fileName && (
                    <Typography variant="body2" className="text-gray-600">
                      Сонгогдсон файл: {fileName}
                    </Typography>
                  )}
                  {touched.file && errors.file && (
                    <Typography variant="caption" color="error">
                      {errors.file as string}
                    </Typography>
                  )}
                </Box>

                <Alert severity="info" className="mt-8 mb-4">
                  Таны хүсэлт 3 хоногийн дотор шийдвэрлэгдэх бөгөөд шийдвэрлэгдсэн үед бүртгэлтэй и-мэйл хаягаар мэдэгдэх болно.
                </Alert>

                <Box className="flex justify-end">
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={loading}
                    size="large"
                  >
                    {loading ? "Илгээж байна..." : "Илгээх"}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        )}
      </Paper>
    </Container>
        </div>
      </div>
    </div>
  );
};

export default RequestAccessPage;


