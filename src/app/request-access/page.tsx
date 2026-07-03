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
  Slider,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Typography,
} from "@mui/material"; 
import Cropper from "react-easy-crop";
import { getCroppedFile } from "@/utils/cropImage";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import { styled } from "@mui/material/styles";
import LogoPics from "@/components/layout/LogoPics";
import FileComponent from "@/components/admin/formComponents/FIle";
import { mailTemplateOrgNew } from "@/utils/helper-mail";
import { sendMail } from "@/services/MailService";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Crop state
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [currentFileName, setCurrentFileName] = useState("");
  const [formikSetFieldValue, setFormikSetFieldValue] = useState<any>(null);

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleFileChange = async (event: any, setFieldValue: any) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setCurrentFileName(file.name);
      setFormikSetFieldValue(() => setFieldValue);
      const imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl as string);
      setCropDialogOpen(true);
    }
  };

  const readFile = (file: File) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  };

  const handleSaveCrop = async () => {
    try {
      if (imageSrc && croppedAreaPixels && formikSetFieldValue) {
        const croppedFile = await getCroppedFile(imageSrc, croppedAreaPixels, currentFileName, rotation);
        formikSetFieldValue("file", croppedFile);
        setFileName(currentFileName);
        setCropDialogOpen(false);
      }
    } catch (e) {
      console.error(e);
      setCropDialogOpen(false);
    }
  };

  const validationSchema = Yup.object({
    // Organization
    org_name: Yup.string().required("Байгууллагын нэр оруулна уу."),
    org_email: Yup.string()
      .email("Зөв и-мэйл хаяг оруулна уу.")
      .required("Байгууллагын и-мэйл оруулна уу."),
    org_phone: Yup.string()
      .required("Байгууллагын утас оруулна уу.")
      .matches(/^[0-9+\-\s()]*$/, "Зөвхөн тоо оруулна уу."),
    org_website: Yup.string().url("Зөв веб хаяг оруулна уу (жишээ: https://example.com)"),
    
    // User
    lastname: Yup.string().required("Овог оруулна уу."),
    firstname: Yup.string().required("Нэр оруулна уу."),
    user_email: Yup.string()
      .email("Зөв и-мэйл хаяг оруулна уу.")
      .required("Хэрэглэгчийн и-мэйл оруулна уу."),
    user_phone: Yup.string()
      .matches(/^[0-9+\-\s()]*$/, "Зөвхөн дугаар оруулна уу."),
    
    // File
    file: Yup.mixed().required("Байгууллагын лого оруулна уу."),
    file_id: Yup.mixed()
      .required("Тушаал оруулна уу.")
      .test('fileSize', 'Файлын хэмжээ 20MB-аас бага байх ёстой.', (value: any) => {
        if (!value) return true;
        return value.size <= 20 * 1024 * 1024;
      }),
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
      formData.append("file_id", values.file_id);

      const response = await fetch("/api/request-access", {
        method: "POST",
        body: formData,
      });

      // 413/504 зэрэгт nginx JSON биш HTML буцаадаг тул аюулгүй парс
      let data: any = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.ok) {
        // Бүртгэл амжилттай — мэйл унасан ч энэ урсгалыг блоклохгүй
        try {
          const template = await mailTemplateOrgNew(values.user_email, values.org_name, values.firstname, values.lastname)
          await sendMail(template);
        } catch (mailErr) {
          console.error("Хүсэлтийн мэдэгдэл мэйл илгээгдсэнгүй:", mailErr);
        }
        setStatus("success");
        setMessage("Таны хүсэлтийг хүлээн авлаа. Бид шалгаад хариу мэдэгдэх болно.");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setStatus("error");
        // Статус кодоор тодорхой мессеж
        if (response.status === 413) {
          setMessage("Файлын хэмжээ хэт том байна. Тушаал 20MB, лого 40MB-аас бага байх ёстой.");
        } else if (response.status === 504) {
          setMessage("Сервер удаан хариулж байна. Хэсэг хүлээгээд дахин оролдоно уу.");
        } else {
          setMessage(data.message || `Алдаа гарлаа (код ${response.status}). Дахин оролдоно уу.`);
        }
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("Сүлжээний алдаа гарлаа. Интернэт холболтоо шалгана уу.");
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
            <h1 className="uppercase text-text-title-large text-white">
            Төрөлжсөн бүртгэлийн нэгдсэн сан
            </h1>
          </div>
        </div>

        {/* Form Section */}
        <div className="py-8">
        <Container maxWidth="md">
          <Paper elevation={0} className="p-8 border-none !bg-[#3D4E6C33] !text-white backdrop-blur-sm shadow-xl border border-gray-700 relative">
        <IconButton
          className="absolute top-4 left-4 !text-white hover:bg-white/10"
          onClick={() => router.push("/login")}
        >
          <ArrowBackIcon />
        </IconButton>
        
        <Typography className="uppercase text-text-title-medium mb-6 font-light text-center mt-8 !text-white">
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
              file_id: null,
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

                <Typography variant="h6" className="mb-4 !text-white">
                  Байгууллагын мэдээлэл
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box className="flex flex-col gap-1">
                      <FormLabel className="text-text-body-medium !text-white">
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
                      <FormLabel className="text-text-body-medium !text-white">
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
                      <FormLabel className="text-text-body-medium !text-white">
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
                      <FormLabel className="text-text-body-medium !text-white">
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
                      <FormLabel className="text-text-body-medium !text-white">
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
                      <FormLabel className="text-text-body-medium !text-white">
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

                <Typography variant="h6" className="mb-4 !text-white">
                  Админ хэрэглэгчийн мэдээлэл
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box className="flex flex-col gap-1">
                      <FormLabel className="text-text-body-medium !text-white">
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
                      <FormLabel className="text-text-body-medium !text-white">
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
                      <FormLabel className="text-text-body-medium !text-white">
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
                      <FormLabel className="text-text-body-medium !text-white">
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
                      <FormLabel className="text-text-body-medium !text-white">
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
                      <FormLabel className="text-text-body-medium !text-white">
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

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box className="flex flex-col gap-2">
                      <FormLabel className="text-text-body-medium !text-white">
                        Байгууллагын лого
                      </FormLabel>
                      <Button
                        component="label"
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                        className="w-fit"
                      >
                        Лого хуулах
                        <VisuallyHiddenInput
                          type="file"
                          accept="image/*"
                          onChange={(event) => handleFileChange(event, setFieldValue)}
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
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box className="flex flex-col gap-1">
                      <FormLabel className="text-text-body-medium !text-white">
                        Тушаал
                      </FormLabel>
                      <FileComponent
                        label="Тушаал"
                        name="file"
                        accept=".pdf, .doc, .docx, .xls, .xlsx"
                        onChange={(fileData: any) => {
                          setSelectedFile(fileData);
                          setFieldValue("file_id", fileData);
                        }}
                        value={values?.file_id}
                        desabled={false}
                      />
                      {touched.file_id && errors.file_id && (
                        <Typography variant="caption" color="error">
                          {errors.file_id as string}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>

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
      
      <Dialog
        open={cropDialogOpen}
        onClose={() => setCropDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "#1e1e1e",
            color: "white",
            backgroundImage: "none",
            borderRadius: 2
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #333' }}>Лого зураг тайрах</DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
            <Box className="relative w-full h-[300px] bg-black rounded overflow-hidden mb-6 border border-gray-700">
                {imageSrc && (
                    <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation}
                    aspect={1}
                    onCropChange={setCrop}
                    onRotationChange={setRotation}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    />
                )}
            </Box>
            
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" gap={2}>
                  <RotateRightIcon sx={{ color: '#aaa' }} />
                  <Typography variant="body2" sx={{ minWidth: 60, color:'#aaa' }}>Эргүүлэх</Typography>
                  <Slider
                      value={rotation}
                      min={0}
                      max={360}
                      step={1}
                      aria-labelledby="Rotation"
                      onChange={(e, val) => setRotation(Number(val))}
                      sx={{ 
                        color: '#518df9',
                        '& .MuiSlider-thumb': {
                          '&:hover, &.Mui-focusVisible': {
                            boxShadow: '0px 0px 0px 8px rgba(81, 141, 249, 0.16)',
                          },
                        },
                      }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" gap={2}>
                  <ZoomInIcon sx={{ color: '#aaa' }} />
                  <Typography variant="body2" sx={{ minWidth: 60, color:'#aaa' }}>Томруулах</Typography>
                  <Slider
                      value={zoom}
                      min={1}
                      max={3}
                      step={0.1}
                      aria-labelledby="Zoom"
                      onChange={(e, val) => setZoom(Number(val))}
                      sx={{ color: '#518df9' }}
                  />
                </Box>
              </Grid>
            </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #333' }}>
            <Button onClick={() => setCropDialogOpen(false)} sx={{ color: '#aaa' }}>Болих</Button>
            <Button onClick={handleSaveCrop} variant="contained" color="primary">
                Хадгалах
            </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RequestAccessPage;


