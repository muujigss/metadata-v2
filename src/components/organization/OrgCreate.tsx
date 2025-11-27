"use client";
import React, { useState } from "react";
import { createOrganization } from "@/services/OrganizationService";
import { imageUpload } from "@/utils/customHooks";
import { Alert, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import FileUploadLineIcon from "remixicon-react/FileUploadLineIcon";
import Loader from "../Loader";
import InputComponent from "../admin/form/InputComponent";
import SwitchComponent from "../admin/form/SwitchComponent";

const OrgCreate = () => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const fileTypes = ["image/png", "image/jpg", "image/jpeg"];

  if (loading) return <Loader />;

  return (
    <div className="bg-white px-4 py-4 w-full">
      <p className="text-text-title-medium py-2">Байгууллага нэмэх</p>
      <Formik
        initialValues={{
          org_name: "",
          img_url: null,
          phone: null,
          email: "",
          address: "",
          website: "",
          org_short_name: "",
          enabled: true,
        }}
        validationSchema={Yup.object({
          org_name: Yup.string().required("Байгууллагын нэр оруулна уу."),
          img_url: Yup.mixed()
            .test(
              "fileSize",
              "Зурагын хэмжээ 1GB-аас их байна.",
              (value: any) => {
                if (!value) {
                  return true;
                }
                if (value.size <= 1048576) {
                  return true;
                }
                return false;
              }
            )
            .test("is-not-image", "Зурагын төрөл буруу байна", (value: any) => {
              if (!value) {
                return true;
              }
              if (value && fileTypes.includes(value.type)) {
                return true;
              }
              return false;
            }),
          phone: Yup.string()
            .min(6, "Утас 6 оронгоос бага байна")
            .max(8, "Утас 8 оронгоос их байна")
            .required("Утас оруулна уу."),
          email: Yup.string().required("Имэйл оруулна уу."),
          address: Yup.string().required("Хаяг оруулна уу."),
          website: Yup.string().required("Вэб сайт оруулна уу."),
          org_short_name: Yup.string().required(
            "Байгууллагын товч нэр оруулна уу."
          ),
        })}
        onSubmit={async (values: any) => {
          setLoading(true);
          let resImageUrl = null;
          if (values.img_url) {
            resImageUrl = await imageUpload(values.img_url);
            if (!resImageUrl) {
              setLoading(false);
              setStatus("Зураг хуулахад алдаа гарлаа.");
              return;
            }
          }

          const data = {
            org_name: values.org_name,
            phone: values.phone,
            email: values.email,
            address: values.address,
            website: values.website,
            org_short_name: values.org_short_name,
            enabled: values.enabled,
            img_url: resImageUrl,
          };

          const response = await createOrganization(data);

          if (response?.status === 200) {
            setStatus("Амжилттай хадгаллаа");
          } else {
            setStatus("Мэдээлэл хадгалахад алдаа гарлаа.");
          }
          setLoading(false);
        }}
      >
        {({ handleSubmit, values, setFieldValue, errors }) => {
          return (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
              method="POST"
            >
              {status == "Амжилттай хадгаллаа" ? (
                <Alert severity="success">{status}</Alert>
              ) : status == "Алдаа гарлаа ..." ? (
                <Alert severity="error">{status}</Alert>
              ) : null}
              <div className="grid grid-cols-3 gap-4">
                <InputComponent
                  name="org_name"
                  label="Байгууллагын нэр"
                  type="text"
                  defaultValue={values.org_name}
                  onChange={(e: any) => {
                    setFieldValue("org_name", e.target.value);
                  }}
                  errors={errors.org_name}
                />
                <InputComponent
                  name="phone"
                  label="Утас"
                  type="number"
                  onChange={(e: any) => {
                    setFieldValue("phone", e.target.value);
                  }}
                  errors={errors.phone}
                />
                <InputComponent
                  name="email"
                  label="И-мэйл"
                  type="email"
                  onChange={(e: any) => {
                    setFieldValue("email", e.target.value);
                  }}
                  errors={errors.email}
                />
                <InputComponent
                  name="address"
                  label="Хаяг"
                  type="text"
                  onChange={(e: any) => {
                    setFieldValue("address", e.target.value);
                  }}
                  errors={errors.address}
                />
                <InputComponent
                  name="website"
                  label="Вэб хаяг"
                  type="text"
                  onChange={(e: any) => {
                    setFieldValue("website", e.target.value);
                  }}
                  errors={errors.website}
                />
                <InputComponent
                  name="org_short_name"
                  label="Товч нэр"
                  type="text"
                  onChange={(e: any) => {
                    setFieldValue("org_short_name", e.target.value);
                  }}
                  errors={errors.org_short_name}
                />
                <div className="flex flex-wrap items-center justify-start gap-4 p-2">
                  <Button
                    className="bg-primary-default items-center p-2 text-text-body-small"
                    variant="contained"
                    component="label"
                    tabIndex={-1}
                    startIcon={<FileUploadLineIcon size={16} />}
                    size="small"
                  >
                    Зураг оруулах
                    <TextField
                      className="hidden h-8"
                      size="small"
                      type="file"
                      name="img_url"
                      defaultValue={values.img_url}
                      hidden
                      onChange={(e: any) => {
                        setFieldValue("img_url", e.target.files[0]);
                      }}
                    />
                  </Button>
                  {values.img_url && (
                    <p className="text-text-body-small px-2 text-tertirary-default">
                      {values.img_url?.name}
                    </p>
                  )}
                  <span className="px-2">
                    {errors.img_url && (
                      <p className="text-red-500 text-text-body-small py-3">
                        {errors.img_url?.toString()}
                      </p>
                    )}
                  </span>
                </div>
                <SwitchComponent
                  name="enabled"
                  label="Идэвхтэй эсэх"
                  defaultChecked={values.enabled}
                  onChange={(e: any) => {
                    setFieldValue("enabled", e.target.checked);
                  }}
                />
              </div>
              <div className="flex justify-end p-3">
                <Button
                  className="text-primary-default bg-primary-medium bg-opacity-50 hover:bg-tertirary-background hover:text-tertirary-default"
                  variant="contained"
                  color="success"
                  type="submit"
                  size="small"
                >
                  Хадгалах
                </Button>
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default OrgCreate;
