"use client";
import { IUser } from "@/interfaces/IUser";
import { getDatabase } from "@/services/DatabaseService";
import { createUserService } from "@/services/UserService";
import CurrentUserContext, { ICurrentUserContext } from "@/utils/context";
import {
  useGetOrgs,
  useGetUserLevel,
  useGetUserRole,
  useOrgRoleCount,
} from "@/utils/customHooks";
import { Alert, Box, Button, Input, Snackbar, Typography, alertClasses } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { useContext, useState } from "react";
import * as Yup from "yup";
import {
  FormBox,
  InputComponent,
  LabelComponent,
  MultiSelectComponent,
  SelectComponent,
  SwitchComponent,
} from "../admin/formComponents";
import TooltipComponent from "../admin/formComponents/TooltipComponent";
import Loader from "../Loader";
import { createFileService } from "@/services/FileService";

const CreateUserForm = ({ userData }: { userData?: IUser }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [statusCode, setStatusCode] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const { userInfo } = useContext(CurrentUserContext) as ICurrentUserContext;
  let userLevel = userInfo?.user_level || 0;
  let orgId = userInfo?.org_id || 0;

  const { data: orgListData, isLoading: orgLoading } = useQuery({
    queryKey: ["db list by org", orgId],
    queryFn: () => getDatabase(orgId),
  });
  const { data: orgData, isLoading } = useGetOrgs();
  const { data: userLevels, isLoading: userLevelLoading } = useGetUserLevel();
  const { data: userRoles, isLoading: userRoleLoading } = useGetUserRole();
  const {
    data: orgRoles,
    isLoading: orgRoleLoading,
    isError: orgRoleError,
  } = useOrgRoleCount(userInfo?.org_id || 0);

  const validationSchema = Yup.object({
    org_id: Yup.string().required("Байгууллага сонгоно уу."),
    firstname: Yup.string().min(2).max(30).required("Нэр оруулна уу."),
    lastname: Yup.string().min(2).max(30).required("Овог оруулна уу."),
    department: Yup.string().required("Хэлтсийн нэр оруулна уу."),
    position: Yup.string().required("Албан тушаал оруулна уу."),
    email: Yup.string().email().required("И-мэйл хаяг оруулна уу."),
    mobile: Yup.string().min(6).max(8).required("Утасны дугаар оруулна уу."),
    phone_number: Yup.string()
      .min(6)
      .max(8)
      .required("Утасны дугаар оруулна уу."),
    user_level: Yup.string().required("Хэрэглэгчийн түвшин сонгоно уу."),
  });

  const userRolesData =
    userData?.roles &&
    userData?.roles?.map((role: any) => {
      return +role?.id;
    });

  const userDBdata: IUser =
    userData?.md_user_database &&
    userData?.md_user_database?.map((db: any) => {
      return +db?.database_id;
    });

  let initValues = {
    user_id: userData?.id || 0,
    org_id: userLevel != 1 ? Number(orgId) : userData?.org_id || 0,
    user_level: userData?.user_level || 0,
    firstname: userData?.firstname || "",
    lastname: userData?.lastname || "",
    department: userData?.department || "",
    position: userData?.position || "",
    email: userData?.email || "",
    phone_number: userData?.phone_number || "",
    mobile: userData?.mobile || "",
    profile_img_url: userData?.profile_img_url || "",
    is_active: userData?.is_active || false,
    roles: userRolesData || [],
    last_login_date: new Date(),
    login_attempts: userData?.login_attempts || 0,
    md_user_database: userDBdata || [],
  };

  if (orgLoading) {
    return <Loader />;
  }

  if (isLoading) {
    return <Loader />;
  }
  if (userLevelLoading) {
    return <Loader />;
  }
  if (userRoleLoading) {
    return <Loader />;
  }

  const userCustomLevels = userLevel.toString() === "1" ? userLevels : (userLevels.filter((item: any) => item.id != 1));

  const handleWarning = (level: number) => {
    /**
     * User Level
     * 1	Системийн зохиуцуулагч
     * 2	Мэдээлэл хариуцагч админ
     * 3	Мэдээлэл хариуцагч хэрэглэгч
     *
    */
    const levelCodes = [2, 3];
    if (!levelCodes.includes(level) || level == 3) return;
    let msg = ""
    const count = orgRoles.filter((role: any) => role.user_level == level);
    if (level == 2) {
      msg = "Мэдээлэл хариуцагч админ бүртгэлтэй байна."
    }
    // if (level == 3) {
    //   msg = "Мэдээлэл хариуцагч хэрэглэгч бүртгэлтэй байна."
    // }
    if (count.length > 0) {
      setOpenAlert(true)
      setWarningMessage(msg);
      return;
    }
  };

  return (
    <>
      <Box>
        {statusCode == "error" ? (
          <Alert severity="warning">{alertMessage}</Alert>
        ) : statusCode == "200" ? (
          <Alert severity="success">{alertMessage}</Alert>
        ) : null}
      </Box>
      <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={() => setOpenAlert(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Box>
          <Alert
            severity="error"
            sx={{
              width: "100%",
              [`& .${alertClasses.icon}`]: {
                top: 0,
              },
            }}
          >
            {warningMessage}
          </Alert>
        </Box>
      </Snackbar>
      <Formik
        initialValues={initValues}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          // const formData = new FormData();
          // formData.append("created_user", userInfo?.id);
          // if (selectedFile) {
          //   formData.append("file", selectedFile);
          // }
          // const responseFile = (await createFileService(formData)).data;

          const data: IUser = {
            user_id: Number(values?.user_id),
            org_id: values.user_level != 1 ? values?.org_id : 17,
            //17 - Цахим хөгжил, инновац, харилцаа холбооны яам
            user_level: values?.user_level,
            firstname: values?.lastname,
            lastname: values?.firstname,
            department: values?.department,
            position: values?.position,
            email: values?.email,
            phone_number: values?.phone_number,
            mobile: values?.mobile,
            profile_img_url: values?.profile_img_url,
            is_active: values?.is_active,
            roles: values?.roles,
            last_login_date: new Date(),
            md_user_database: values?.md_user_database,
          };

          const response = await createUserService(data);

          if (response.status) {
            setStatusCode("200");
            setAlertMessage("Амжилттай хадгаллаа!");
            //setOpenModal(false);
            window.location.reload();
          } else {
            setStatusCode("error");
            setAlertMessage(response.message);
          }
        }}
        enableReinitialize={true}
      >
        {({ handleSubmit, values, setFieldValue, errors }) => {
          return (
            <Form method="post" onSubmit={handleSubmit} encType="multipart/form-data">
              <Input type="hidden" value={values?.user_id} />
              {/* <Button variant="contained" component="label">
                Choose File
                <input
                  type="file"
                  hidden
                  onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null) }
                />
              </Button> */}

              {selectedFile && <Typography variant="body2">Selected file: {selectedFile.name}</Typography>}
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="Хэрэглэгчийн түвшин" />
                  <TooltipComponent content="Хэрэглэгчийн түвшин" />
                </Box>
                <SelectComponent
                  options={userCustomLevels}
                  desabled={values?.user_id && userInfo?.user_level === 2 && userInfo?.id === values?.user_id ? true : false}
                  defaultValue={values.user_level}
                  label="Хэрэглэгчийн түвшин"
                  name="user_level"
                  onChange={(e: any, value: any) => {
                    handleWarning(value)
                    setFieldValue("user_level", value);
                  }}
                  errors={errors?.user_level}
                />
              </FormBox>
              {values.user_level != 1 && (
                <FormBox>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LabelComponent label="Байгууллагын нэр" />
                    <TooltipComponent content="Тухайн хэрэглэгчийн ажилладаг байгууллагын нэр" />
                  </Box>
                  <SelectComponent
                    options={orgData}
                    desabled={userLevel != 1 ? true : false}
                    defaultValue={values.org_id}
                    label="Байгууллагын нэр"
                    name="org_id"
                    onChange={(e: any, value: any) => {
                      setFieldValue("org_id", value);
                    }}
                    errors={errors?.org_id}
                  />
                </FormBox>
              )}

              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="Овог" />
                  <TooltipComponent content="Овог" />
                </Box>
                <InputComponent
                  type="text"
                  name="lastname"
                  value={values?.lastname}
                  label="Овог"
                  onChange={(e: any) => {
                    setFieldValue("lastname", e.target.value);
                  }}
                  errors={errors?.lastname}
                />
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="Нэр" />
                  <TooltipComponent content="Нэр" />
                </Box>
                <InputComponent
                  type="text"
                  name="firstname"
                  value={values?.firstname}
                  label="Нэр"
                  onChange={(e: any) => {
                    setFieldValue("firstname", e.target.value);
                  }}
                  errors={errors?.firstname}
                />
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="Хэлстийн нэр" />
                  <TooltipComponent content="Хэлстийн нэр" />
                </Box>
                <InputComponent
                  type="text"
                  name="department"
                  value={values?.department}
                  label="Хэлстийн нэр"
                  onChange={(e: any) => {
                    setFieldValue("department", e.target.value);
                  }}
                  errors={errors?.firstname}
                />
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="Албан тушаал" />
                  <TooltipComponent content="Албан тушаал" />
                </Box>
                <InputComponent
                  type="text"
                  name="position"
                  value={values?.position}
                  label="Албан тушаал"
                  onChange={(e: any) => {
                    setFieldValue("position", e.target.value);
                  }}
                  errors={errors?.position}
                />
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="Гар утасны дугаар" />
                  <TooltipComponent content="Гар утасны дугаар" />
                </Box>
                <InputComponent
                  type="number"
                  name="mobile"
                  value={values?.mobile}
                  label="Гар утасны дугаар"
                  onChange={(e: any) => {
                    setFieldValue("mobile", e.target.value);
                  }}
                  errors={errors?.mobile}
                />
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="Утасны дугаар" />
                  <TooltipComponent content="Утасны дугаар" />
                </Box>
                <InputComponent
                  type="number"
                  name="phone_number"
                  value={values?.phone_number}
                  label="Утасны дугаар"
                  onChange={(e: any) => {
                    setFieldValue("phone_number", e.target.value);
                  }}
                  errors={errors?.phone_number}
                />
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="И-мэйл хаяг" />
                  <TooltipComponent content="И-мэйл хаяг" />
                </Box>
                <InputComponent
                  type="text"
                  name="email"
                  value={values?.email}
                  label="И-мэйл хаяг"
                  onChange={(e: any) => {
                    setFieldValue("email", e.target.value);
                  }}
                  errors={errors?.email}
                />
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="Хэрэглэгчийн эрх" />
                  <TooltipComponent content="Хэрэглэгчийн ажиллах хүрээний эрхийг сонгох" />
                </Box>
                <MultiSelectComponent
                  options={userRoles}
                  name="roles"
                  label="Хэрэглэгчийн эрх:"
                  value={values.roles}
                  onChange={(e: any, newValue: any) => {
                    setFieldValue("roles", newValue);
                  }}
                  errors={errors.roles}
                />
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="Идэвхитэй эсэх" />
                  <TooltipComponent content="Хэрэглэгчийн идэвхитэй төлөвийг сонгох" />
                </Box>
                <SwitchComponent
                  name="is_active"
                  label="Идэвхтэй эсэх"
                  defaultChecked={values?.is_active}
                  desabled={values?.user_id && userInfo?.user_level === 2 && userInfo?.id === values?.user_id ? true : false}
                  onChange={(e) => {
                    setFieldValue("is_active", e.target.checked);
                  }}
                />
              </FormBox>
              {userLevel != 1 && (
                <FormBox>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LabelComponent label="Хариуцах өгөгдлийн сан" />
                    <TooltipComponent content="Тухайн албан хаагчийн хариуцах өгөгдлийн сан сонгох" />
                  </Box>
                  <MultiSelectComponent
                    options={orgListData?.data}
                    name="md_user_database"
                    label="Өгөгдлийн сан сонгох:"
                    value={values.md_user_database}
                    onChange={(e: any, newValue: any) => {
                      setFieldValue("md_user_database", newValue);
                    }}
                  />
                </FormBox>
              )}
              <div className="flex justify-end p-3">
                <Button
                  type="submit"
                  size="small"
                  className="text-primary-default bg-primary-medium bg-opacity-50 hover:bg-tertirary-background hover:text-tertirary-default"
                  variant="contained"
                  color="success"
                >
                  Хадгалах
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default CreateUserForm;
