import React, { useState } from "react";
import { Formik } from "formik";
import SelectComponent from "../admin/form/SelectComponent";
import InputComponent from "../admin/form/InputComponent";
import { useQuery } from "@tanstack/react-query";
import { getDatabase } from "@/services/DatabaseService";
import { Button, Alert, TextField, Box } from "@mui/material";
import * as Yup from "yup";
import {
  fileUpload,
  useGetCollectionMethod,
  useGetDissimenationLevel,
  useGetFrequencies,
  useGetSectors,
  useGetSecurityLevels,
  useGetSources,
} from "@/utils/customHooks";
import MultiSelectComponent from "../admin/form/MultiSelectComponent";
import SwitchComponent from "../admin/form/SwitchComponent";
import FileUploadLineIcon from "remixicon-react/FileUploadLineIcon";
import { createForm, updateFrom } from "@/services/FormService";
import Loader from "../Loader";
import LabelComponent from "../admin/form/LabelComponent";
import { TextAreaComponent } from "../admin/form";
import { IForm } from "@/interfaces/IForm";
import moment from "moment";

const FormCreate = ({
  dbId,
  setTabStatus,
  setAlert,
  formData,
  sidebarStatus,
  setSidebarStatus,
  form_id,
}: {
  dbId: any;
  setTabStatus: any;
  setAlert: any;
  formData?: IForm;
  sidebarStatus?: boolean;
  setSidebarStatus?: any;
  form_id?: any;
}) => {
  const { data: database } = useQuery({
    queryKey: ["fetch datatabse list for form"],
    queryFn: () => getDatabase(1),
    refetchOnWindowFocus: true,
  });
  const { data: sectors } = useGetSectors();
  const { data: sources } = useGetSources();
  const { data: collections } = useGetCollectionMethod();
  const { data: frenquencies } = useGetFrequencies();
  const { data: dissimenations } = useGetDissimenationLevel();
  const { data: securityLevels } = useGetSecurityLevels();

  const dbOptions = database?.data?.map((db: any) => {
    return { id: db.db_id, name: db.db_name };
  });

  const initialSource = formData?.source_id?.map((item: any) => {
    return +item.id;
  });
  const initialCollection = formData?.collection_method_id?.map((item: any) => {
    return +item.id;
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const fileType = ["application/pdf"];

  if (loading) return <Loader />;
  return (
    <div className="bg-white px-4 py-4 w-full h-fit">
      <p className="text-text-title-medium py-2">Маягт нэмэх</p>
      <Formik
        initialValues={{
          db_id: dbId,
          form_name: formData?.form_name || "",
          form_code: formData?.form_code || "",
          form_description: formData?.form_description || "",
          decree_num: formData?.decree_num || "",
          confirmed_date:
            moment(formData?.confirmed_date).format("YYYY-MM-DD") || null,
          confirmed_organization1: formData?.confirmed_organization1 || "",
          confirmed_organization2: formData?.confirmed_organization2 || "",
          sector_id: formData?.sector_id || null,
          sector_other: formData?.sector_other || "",
          sub_sector: formData?.sub_sector || "",
          coorperate_organization: formData?.coorperate_organization || "",
          source_id: initialSource || ([] as any),
          source_other: formData?.source_other || "",
          collection_method_id: initialCollection || ([] as any),
          collection_method_other: formData?.collection_method_other || "",
          frequency_id: formData?.frequency_id || null,
          frequency_other: formData?.frequency_other || "",
          collection_started_date: formData?.collection_started_date || null,
          dissimenation_level_id: formData?.dissimenation_level_id || null,
          is_form_guide: formData?.is_form_guide || false,
          form_guide_decree_num: formData?.form_guide_decree_num || "",
          collected_officer: formData?.collected_officer || "",
          security_level_id: formData?.security_level_id || null,
          owner_department: formData?.owner_department || "",
          owner_email: formData?.owner_email || "",
          owner_phone: formData?.owner_phone || null,
          form_generated_date: formData?.form_generated_date || null,
          form_updated_date: formData?.form_updated_date || "",
          form_table_count: formData?.form_table_count || null,
          estimated_indicators: formData?.estimated_indicators || "",
          keywords: formData?.keywords || "",
          files: null as any,
          form_status: formData?.form_status || true,
        }}
        validationSchema={Yup.object({
          db_id: Yup.string().required("Өгөгдлийн сан сонгоно уу"),
          form_name: Yup.string().required("Маягтын нэр оруулна уу"),
          form_code: Yup.string().required("Маягтын шифр, дугаар оруулна уу"),
          form_description: Yup.string().required("Маягтын тайлбар оруулна уу"),
          decree_num: Yup.string().required("Тушаалын дугаар оруулна уу"),
          confirmed_date: Yup.date().required(
            "Маягт баталсан огноо оруулна уу."
          ),
          confirmed_organization1: Yup.string().required(
            "Маягт баталсан байгууллага оруулна уу"
          ),
          sector_id: Yup.string().required("Салбар сонгоно уу"),
          sector_other: Yup.string().when("sector_id", (sector) => {
            if (sector.includes("43")) {
              return Yup.string().required("Салбар бичнэ үү.");
            }
            return Yup.string();
          }),
          sub_sector: Yup.string().required("Дэд салбар бичнэ үү"),
          coorperate_organization: Yup.string().required(
            "Хамтран гаргадаг байгууллага	бичнэ үү."
          ),
          source_id: Yup.array()
            .of(
              Yup.number().required(
                "Анхан шатны мэдээлэгч/ эх үүсврийн төрөл сонгоно уу."
              )
            )
            .min(1, "Анхан шатны мэдээлэгч/ эх үүсврийн төрөл сонгоно уу."),
          source_other: Yup.string().when("source_id", (source) => {
            const sp = source?.map((sc: any) => {
              return sc.includes(5);
            })[0];

            if (sp) {
              return Yup.string().required("Зориулалтын бусад төрөл бичнэ үү.");
            }
            return Yup.string();
          }),
          collection_method_id: Yup.array()
            .of(
              Yup.number().required(
                "Мэдээлэл цуглуулах, бүрдүүлэх хэлбэр сонгоно уу."
              )
            )
            .min(1, "Мэдээлэл цуглуулах, бүрдүүлэх хэлбэр сонгоно уу."),
          collection_method_other: Yup.string().when(
            "collection_method_id",
            (collection) => {
              const sp = collection?.map((sc: any) => {
                return sc.includes(7);
              })[0];

              if (sp) {
                return Yup.string().required(
                  "Мэдээлэл цуглуулах, бүрдүүлэх бусад хэлбэр бичнэ үү."
                );
              }
              return Yup.string();
            }
          ),
          frequency_id: Yup.string().required("Давтамж сонгоно уу"),
          frequency_other: Yup.string().when("frequency_id", (frequency) => {
            if (frequency.includes("7")) {
              return Yup.string().required("Давтамж бичнэ үү.");
            }
            return Yup.string();
          }),
          collection_started_date: Yup.string()
            .min(4, "Он 4 оронгоос бага байна.")
            .max(4, "Он  4 оронгоос их байна.")
            .required("Бүрдүүлж эхэлсэн он оруулна уу.")
            .transform((value, originalValue) => {
              const currentYear = new Date().getFullYear();
              const beforeYear = new Date("1900-01-01").getFullYear();
              if (
                Number(originalValue) > currentYear ||
                Number(originalValue) < beforeYear
              ) {
                return true;
              }
              return value;
            })
            .typeError("Он буруу байна."),
          form_generation_date: Yup.string()
            .min(4, "Он 4 оронгоос бага байна.")
            .max(4, "Он  4 оронгоос их байна.")
            .transform((value, originalValue) => {
              const currentYear = new Date().getFullYear();
              const beforeYear = new Date("1900-01-01").getFullYear();
              if (
                Number(originalValue) > currentYear ||
                Number(originalValue) < beforeYear
              ) {
                return true;
              }
              return value;
            })
            .typeError("Он буруу байна."),
          form_updated_date: Yup.string()
            .min(4, "Он 4 оронгоос бага байна.")
            .max(4, "Он  4 оронгоос их байна.")
            .transform((value, originalValue) => {
              const currentYear = new Date().getFullYear();
              const beforeYear = new Date("1900-01-01").getFullYear();
              if (
                Number(originalValue) > currentYear ||
                Number(originalValue) < beforeYear
              ) {
                return true;
              }
              return value;
            })
            .typeError("Он буруу байна."),
          dissimenation_level_id: Yup.string().required(
            "Үр дүнг тархаах түвшин сонгоно уу."
          ),
          files: Yup.mixed()
            .test("is-not-pdf", "Файлын төрөл буруу байна", (value: any) => {
              if (!value) {
                return true;
              }
              if (value && fileType.includes(value.type)) {
                return true;
              }
              return false;
            })
            .required("Файл оруулна уу."),
          form_table_count: Yup.string().required(
            "Маягтын хүснэгтийн тоо оруулна уу."
          ),
        })}
        onSubmit={async (values) => {
          const resImageUrl = await fileUpload(values.files);

          if (resImageUrl) {
            setLoading(true);
            let res;
            if (sidebarStatus) {
              const data = {
                ...values,
                files: resImageUrl,
              };

              res = await updateFrom(form_id, data);
            } else {
              res = await createForm({
                ...values,
                files: resImageUrl,
              });
            }
            if (res.status == "success") {
              if (sidebarStatus) {
                setAlert("success");
                setSidebarStatus(false);
              } else {
                setAlert("success");
                setTabStatus("get");
              }
            } else {
              setAlert("error");
              setSidebarStatus(false);
            }
            setLoading(false);
            // setAlert("success");
            // setTabStatus("get");
          } else {
            setAlert("error");
          }
        }}
      >
        {({ handleSubmit, values, setFieldValue, errors }) => {
          return (
            <form className="w-full" method="POST" onSubmit={handleSubmit}>
              <Box
                sx={{
                  width: "100%",
                  py: 2,
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #E0E0E0",
                }}
              >
                <LabelComponent label="Өгөгдлийн сан:" />
                <SelectComponent
                  options={dbOptions}
                  label="Өгөгдлийн сан"
                  name="db_id"
                  defaultValue={values.db_id}
                  desabled={true}
                  onChange={(e: any, newValue: any) => {
                    setFieldValue("db_id", newValue);
                  }}
                  errors={errors?.db_id}
                />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  py: 2,
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #E0E0E0",
                }}
              >
                <LabelComponent label="Маягтын нэр:" />
                <InputComponent
                  type="text"
                  name="form_name"
                  label="Маягтын нэр"
                  value={values.form_name}
                  onChange={(e: any) => {
                    setFieldValue("form_name", e.target.value);
                  }}
                  errors={errors.form_name}
                />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  py: 2,
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #E0E0E0",
                }}
              >
                <LabelComponent label="Маягтын шифр, дугаар:" />
                <InputComponent
                  type="text"
                  name="form_code"
                  label="Маягтын шифр, дугаар"
                  value={values.form_code}
                  onChange={(e: any) => {
                    setFieldValue("form_code", e.target.value);
                  }}
                  errors={errors.form_code}
                />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  py: 2,
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #E0E0E0",
                }}
              >
                <LabelComponent label="Маягтын тайлбар:" />
                <TextAreaComponent
                  type="text"
                  name="form_description"
                  label="Маягтын тайлбар"
                  value={values.form_description}
                  onChange={(e: any) => {
                    setFieldValue("form_description", e.target.value);
                  }}
                  errors={errors.form_description}
                />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  py: 2,
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #E0E0E0",
                }}
              >
                <LabelComponent label="Тушаалын дугаар:" />
                <InputComponent
                  type="text"
                  name="decree_num"
                  label="Тушаалын дугаар"
                  value={values.decree_num}
                  onChange={(e: any) => {
                    setFieldValue("decree_num", e.target.value);
                  }}
                  errors={errors.decree_num}
                />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  py: 2,
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #E0E0E0",
                }}
              >
                <LabelComponent label="Маягт баталсан огноо:" />
                <InputComponent
                  type="date"
                  name="confirmed_date"
                  label="Маягт баталсан огноо"
                  value={values.confirmed_date}
                  onChange={(e: any) => {
                    setFieldValue("confirmed_date", e.target.value);
                  }}
                  errors={errors?.confirmed_date}
                />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  py: 2,
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #E0E0E0",
                }}
              >
                <LabelComponent label="Баталсан байгууллага №1:" />
                <InputComponent
                  type="text"
                  name="confirmed_organization1"
                  label="Баталсан байгууллага №1"
                  value={values.confirmed_organization1}
                  onChange={(e: any) => {
                    setFieldValue("confirmed_organization1", e.target.value);
                  }}
                  errors={errors.confirmed_organization1}
                />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  py: 2,
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #E0E0E0",
                }}
              >
                <LabelComponent label="Баталсан байгууллага №2:" />
                <InputComponent
                  type="text"
                  name="confirmed_organization2"
                  label="Баталсан байгууллага  №2"
                  value={values.confirmed_organization2}
                  onChange={(e: any) => {
                    setFieldValue("confirmed_organization2", e.target.value);
                  }}
                  errors={errors.confirmed_organization2}
                />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  py: 2,
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #E0E0E0",
                }}
              >
                <LabelComponent label="Салбар" />
                <SelectComponent
                  options={sectors}
                  label="Салбар"
                  name="sector_id"
                  defaultValue={values.sector_id}
                  onChange={(e: any, newValue: any) => {
                    setFieldValue("sector_id", newValue);
                  }}
                  errors={errors?.sector_id}
                />
              </Box>
              {values.sector_id == 43 && (
                <Box
                  sx={{
                    width: "100%",
                    py: 2,
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr",
                    gap: 2,
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #E0E0E0",
                  }}
                >
                  <LabelComponent label="Салбар бичнэ үү:" />
                  <InputComponent
                    type="text"
                    name="sector_other"
                    label="Салбар бичнэ үү."
                    value={values.sector_other}
                    onChange={(e: any) => {
                      setFieldValue("sector_other", e.target.value);
                    }}
                    errors={errors.sector_other}
                  />
                </Box>
              )}
              <Box
                sx={{
                  width: "100%",
                  py: 2,
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #E0E0E0",
                }}
              >
                <LabelComponent label="Дэд салбар:" />
                <InputComponent
                  type="text"
                  name="sub_sector"
                  label="Дэд салбар"
                  value={values.sub_sector}
                  onChange={(e: any) => {
                    setFieldValue("sub_sector", e.target.value);
                  }}
                  errors={errors.sub_sector}
                />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  py: 2,
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #E0E0E0",
                }}
              >
                <LabelComponent label="Хамтран гаргадаг байгууллага:" />
                <InputComponent
                  type="text"
                  name="coorperate_organization"
                  label="Хамтран гаргадаг байгууллага"
                  value={values.coorperate_organization}
                  onChange={(e: any) => {
                    setFieldValue("coorperate_organization", e.target.value);
                  }}
                  errors={errors.coorperate_organization}
                />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  py: 2,
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #E0E0E0",
                }}
              >
                <LabelComponent label="Анхан шатны мэдээлэгч/ эх үүсвэр:" />
                <MultiSelectComponent
                  options={sources}
                  name="source_id"
                  label="Анхан шатны мэдээлэгч/ эх үүсвэр"
                  value={values.source_id}
                  onChange={(e: any, newValue: any) => {
                    setFieldValue("source_id", newValue);
                  }}
                  errors={errors.source_id}
                />
              </Box>
              {values.source_id.includes(5) && (
                <Box
                  sx={{
                    width: "100%",
                    py: 2,
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr",
                    gap: 2,
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #E0E0E0",
                  }}
                >
                  <LabelComponent label="Анхан шатны мэдээлэгч/ эх үүсвэр бусад:" />
                  <InputComponent
                    type="text"
                    name="source_other"
                    label="Анхан шатны мэдээлэгч/ эх үүсвэр бусад"
                    value={values.source_other}
                    onChange={(e: any) => {
                      setFieldValue("source_other", e.target.value);
                    }}
                    errors={errors.source_other}
                  />
                </Box>
              )}
              <Box
                sx={{
                  width: "100%",
                  py: 2,
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #E0E0E0",
                }}
              >
                <LabelComponent label="Мэдээлэл цуглуулах, бүрдүүлэх хэлбэр:" />
                <MultiSelectComponent
                  options={collections}
                  name="collection_method_id"
                  label="Мэдээлэл цуглуулах, бүрдүүлэх хэлбэр"
                  value={values.collection_method_id}
                  onChange={(e: any, newValue: any) => {
                    setFieldValue("collection_method_id", newValue);
                  }}
                  errors={errors.collection_method_id}
                />
              </Box>
              {values.collection_method_id.includes(7) && (
                <Box
                  sx={{
                    width: "100%",
                    py: 2,
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr",
                    gap: 2,
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #E0E0E0",
                  }}
                >
                  <LabelComponent label="Мэдээлэл цуглуулах, бүрдүүлэх хэлбэр бусад:" />
                  <InputComponent
                    type="text"
                    name="collection_method_id"
                    label="Мэдээлэл цуглуулах, бүрдүүлэх хэлбэр бусад"
                    value={values.collection_method_other}
                    onChange={(e: any) => {
                      setFieldValue("collection_method_other", e.target.value);
                    }}
                    errors={errors.collection_method_other}
                  />
                </Box>
              )}
              <Box
                sx={{
                  width: "100%",
                  py: 2,
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #E0E0E0",
                }}
              >
                <LabelComponent label="Давтамж:" />
                <SelectComponent
                  options={frenquencies}
                  label="Давтамж"
                  name="frequency_id"
                  defaultValue={values?.frequency_id}
                  onChange={(e: any, newValue: any) => {
                    setFieldValue("frequency_id", newValue);
                  }}
                  errors={errors?.frequency_id}
                />
              </Box>
              {values?.frequency_id == 7 && (
                <Box
                  sx={{
                    width: "100%",
                    py: 2,
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr",
                    gap: 2,
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #E0E0E0",
                  }}
                >
                  <LabelComponent label="Давтамж бусад:" />
                  <InputComponent
                    type="text"
                    name="frequency_other"
                    label="Давтамж бичнэ үү."
                    value={values.frequency_other}
                    onChange={(e: any) => {
                      setFieldValue("frequency_other", e.target.value);
                    }}
                    errors={errors.frequency_other}
                  />
                </Box>
              )}
              <Box
                sx={{
                  width: "100%",
                  py: 2,
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #E0E0E0",
                }}
              >
                <LabelComponent label="Бүрдүүлж эхэлсэн он:" />
                <InputComponent
                  type="number"
                  name="collection_started_date"
                  label="Бүрдүүлж эхэлсэн он"
                  value={values.collection_started_date}
                  onChange={(e: any) => {
                    setFieldValue("collection_started_date", e.target.value);
                  }}
                  errors={errors?.collection_started_date}
                />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  py: 2,
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #E0E0E0",
                }}
              >
                <LabelComponent label="Үр дүнг тархаах түвшин буюу үзүүлэлтийн задаргаа:" />
                <SelectComponent
                  options={dissimenations?.data}
                  label="Үр дүнг тархаах түвшин буюу үзүүлэлтийн задаргаа"
                  name="dissimenation_level_id"
                  defaultValue={values?.dissimenation_level_id}
                  onChange={(e: any, newValue: any) => {
                    setFieldValue("dissimenation_level_id", newValue);
                  }}
                  errors={errors?.dissimenation_level_id}
                />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  py: 2,
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #E0E0E0",
                }}
              >
                <LabelComponent label="Маягт нөхөх заавартай эсэх:" />
                <SwitchComponent
                  name="is_form_guide"
                  label="Маягт нөхөх заавартай эсэх"
                  defaultChecked={values.is_form_guide}
                  onChange={(e: any) => {
                    setFieldValue("is_form_guide", e.target.checked);
                  }}
                />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  py: 2,
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #E0E0E0",
                }}
              >
                <LabelComponent label="Маягт нөхөх зааврын нэр, батлагдсан огноо, тушаалын дугаар:" />
                <InputComponent
                  type="text"
                  name="form_guide_decree_num"
                  label="Маягт нөхөх зааврын нэр, батлагдсан огноо, тушаалын дугаар"
                  value={values.form_guide_decree_num}
                  onChange={(e: any) => {
                    setFieldValue("form_guide_decree_num", e.target.value);
                  }}
                  // errors={errors.form_guide_decree_num}
                />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  py: 2,
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #E0E0E0",
                }}
              >
                <LabelComponent label="Мэдээлэл цуглуулах ажилтан:" />
                <InputComponent
                  type="text"
                  name="collected_officer"
                  label="Мэдээлэл цуглуулах ажилтан"
                  value={values.collected_officer}
                  onChange={(e: any) => {
                    setFieldValue("collected_officer", e.target.value);
                  }}
                  // errors={errors.form_guide_decree_num}
                />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  py: 2,
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #E0E0E0",
                }}
              >
                <LabelComponent label="Нууцын зэрэглэл:" />
                <SelectComponent
                  options={securityLevels}
                  label="Нууцын зэрэглэл"
                  name="security_level_id"
                  defaultValue={values?.security_level_id}
                  onChange={(e: any, newValue: any) => {
                    setFieldValue("security_level_id", newValue);
                  }}
                  errors={errors?.security_level_id}
                />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  py: 2,
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #E0E0E0",
                }}
              >
                <LabelComponent label="Хариуцдаг газар / хэлтэс/ нэгж:" />
                <InputComponent
                  type="text"
                  name="owner_department"
                  label="Хариуцдаг газар / хэлтэс/ нэгж"
                  value={values.owner_department}
                  onChange={(e: any) => {
                    setFieldValue("owner_department", e.target.value);
                  }}
                />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  py: 2,
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #E0E0E0",
                }}
              >
                <LabelComponent label="Хариуцсан нэгжийн холбоо барих албаны цахим шуудангийн хаяг:" />
                <InputComponent
                  type="text"
                  name="owner_email"
                  label="Хариуцсан нэгжийн холбоо барих албаны цахим шуудангийн хаяг"
                  value={values.owner_email}
                  onChange={(e: any) => {
                    setFieldValue("owner_email", e.target.value);
                  }}
                />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  py: 2,
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #E0E0E0",
                }}
              >
                <LabelComponent label="Хариуцсан нэгжийн холбоо барих албаны утас:" />
                <InputComponent
                  type="number"
                  name="owner_phone"
                  label="Хариуцсан нэгжийн холбоо барих албаны утас"
                  value={values.owner_phone}
                  onChange={(e: any) => {
                    setFieldValue("owner_phone", e.target.value);
                  }}
                />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  py: 2,
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #E0E0E0",
                }}
              >
                <LabelComponent label="Маягт нэвтрүүлсэн огноо:" />
                <InputComponent
                  type="number"
                  name="form_generated_date"
                  label="Маягт нэвтрүүлсэн огноо"
                  value={values.form_generated_date}
                  onChange={(e: any) => {
                    setFieldValue("form_generated_date", e.target.value);
                  }}
                  errors={errors?.form_generated_date}
                />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  py: 2,
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #E0E0E0",
                }}
              >
                <LabelComponent label="Маягт шинэчилсэн огноо:" />
                <InputComponent
                  type="number"
                  name="form_updated_date"
                  label="Маягт шинэчилсэн огноо"
                  value={values.form_updated_date}
                  onChange={(e: any) => {
                    setFieldValue("form_updated_date", e.target.value);
                  }}
                  errors={errors?.form_updated_date}
                />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  py: 2,
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #E0E0E0",
                }}
              >
                <LabelComponent label="Маягтын хүснэгтийн тоо:" />
                <InputComponent
                  type="number"
                  name="form_table_count"
                  label="Маягтын хүснэгтийн тоо"
                  value={values.form_table_count}
                  onChange={(e: any) => {
                    setFieldValue("form_table_count", e.target.value);
                  }}
                  errors={errors?.form_table_count}
                />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  py: 2,
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #E0E0E0",
                }}
              >
                <LabelComponent label="Тооцож гаргадаг үзүүлэлтүүд:" />
                <TextAreaComponent
                  type="text"
                  name="estimated_indicators"
                  label="Тооцож гаргадаг үзүүлэлтүүд"
                  value={values.estimated_indicators}
                  onChange={(e: any) => {
                    setFieldValue("estimated_indicators", e.target.value);
                  }}
                />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  py: 2,
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #E0E0E0",
                }}
              >
                <LabelComponent label="Түлхүүр үг:" />
                <TextAreaComponent
                  type="text"
                  name="keywords"
                  label="Түлхүүр үг	"
                  value={values.keywords}
                  onChange={(e: any) => {
                    setFieldValue("keywords", e.target.value);
                  }}
                />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  py: 2,
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #E0E0E0",
                }}
              >
                <LabelComponent label=" Маягт оруулах:" />
                <span>
                  <Button
                    className="bg-primary-default p-2 text-text-body-small"
                    variant="contained"
                    component="label"
                    tabIndex={-1}
                    startIcon={<FileUploadLineIcon size={16} />}
                    size="small"
                  >
                    Маягт оруулах
                    <span className="hidden">
                      <TextField
                        className="hidden"
                        size="small"
                        type="file"
                        name="files"
                        defaultValue={values.files}
                        // hidden={true}
                        onChange={(e: any) => {
                          setFieldValue("files", e.target.files[0]);
                        }}
                      />
                    </span>
                  </Button>
                  <span className="flex items-center justify-between gap-4 mt-2">
                    {errors.files && (
                      <p className="text-red-600 text-text-body-small mt-2 p-1">
                        {errors.files?.toString()}
                      </p>
                    )}
                    {values.files && (
                      <p className="text-text-body-small px-2 text-tertirary-default">
                        {values.files.name}
                      </p>
                    )}
                  </span>
                </span>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  py: 2,
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #E0E0E0",
                }}
              >
                <LabelComponent label="Маягт Идэвхтэй эсэх:" />
                <SwitchComponent
                  name="form_status"
                  label="Маягт Идэвхтэй эсэх"
                  defaultChecked={values.form_status}
                  onChange={(e: any) => {
                    setFieldValue("form_status", e.target.checked);
                  }}
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", py: 2 }}>
                <Button
                  className="w-full text-primary-default bg-primary-medium bg-opacity-50 hover:bg-tertirary-background hover:text-tertirary-default"
                  variant="contained"
                  color="success"
                  type="submit"
                  size="small"
                >
                  Хадгалах
                </Button>
              </Box>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default FormCreate;
