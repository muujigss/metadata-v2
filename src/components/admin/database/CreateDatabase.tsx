import { createDatabase } from "@/services/DatabaseService";
import {
  useGetDbLocation,
  useGetDbType,
  useGetLicence,
  useGetOrgs,
  useGetSectors,
  useGetSpecification,
} from "@/utils/customHooks";
import { Alert, Button, Input, Box, Snackbar, Tabs, Tab } from "@mui/material";
import { Sidebar } from "flowbite-react";
import { Formik } from "formik";
import { useState } from "react";
import Loader from "../../Loader";
import { validationSchema, validationTab0Schema, validationTab1Schema } from "./DBValidationSchema";
import {
  FormBox,
  InputComponent,
  LabelComponent,
  MultiSelectComponent,
  SelectComponent,
  SwitchComponent,
  TextAreaComponent,
} from "@/components/admin/formComponents";

import { IDatabase } from "@/interfaces/IDatabase";
import { IOrganization } from "@/interfaces/IOrganization";
import { sidebarTheme } from "@/components/componentTheme/SidebarTheme";
import AutocompleteIntroduction from "../form/SearchSelectComponent";
import TooltipComponent from "../formComponents/TooltipComponent";
import FileComponent from "../formComponents/FIle";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";

const CreateDatabase = ({
  userId,
  orgId,
  setOpen,
  dbData,
  setAlert,
  sidebarStatus,
  setSidebarStatus,
}: {
  userId?: number;
  orgId: number;
  setOpen: (open: boolean) => void;
  dbData: IDatabase;
  setAlert: (status: string) => {};
  sidebarStatus?: boolean;
  setSidebarStatus?: any;
}) => {
  const { data: dbTypes } = useGetDbType();
  const { data: specifications } = useGetSpecification();
  const { data: organizations } = useGetOrgs();
  const { data: sector } = useGetSectors();
  const { data: dbLocation } = useGetDbLocation();
  const { data: licenceType } = useGetLicence();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [step, setStep] = useState(0);

  const orgData = organizations?.map((org: IOrganization) => {
    return { name: org.name, id: org.id };
  });

  const sectorOptions = sector?.map((sector: any) => {
    return { name: sector.name, id: sector.id };
  });

  const specList =
    dbData?.spec &&
    dbData?.spec?.map((sp: { id: string }) => {
      return +sp?.id;
    });

  const initDB = {
    id: dbData?.id || 0,
    org_id: orgId,
    name: dbData?.name || "",
    description: dbData?.description || "",
    spec: specList || [],
    spec_other: dbData?.spec_other || "",
    db_type: (dbData?.databaseType && dbData?.databaseType.id) || null,
    db_type_other: dbData?.db_type_other || "",
    db_location: dbData?.databaseLocation?.id || null,
    db_location_other: dbData?.db_location_other || "",
    sector: dbData?.sectors?.id || null,
    sector_other: dbData?.sector_other || "",
    licence_type: (dbData?.licenceType && dbData?.licenceType.id) || "",
    licence_type_other: dbData?.licence_type_other || "",
    opendata_url: dbData?.opendata_url || "",
    table_count: dbData?.table_count || null,
    start_date: dbData?.start_date || null,
    is_form: dbData?.is_form || false,
    is_active: dbData?.is_active || false,
    version: dbData?.version || "",
    createdUser: userId || 0,
  };

  const initDB1 = {
    tab0_id: dbData?.id || 0,
    tab0_org_id: orgId,
    tab0_name: dbData?.name || "",
    tab0_short_name: dbData?.short_name || "",
    tab0_domain_name: dbData?.tab0_domain_name || "", // 5.11.1.3
    tab0_scope: dbData?.scope || "", // 5.11.1.4
    tab0_regulation_file_id: dbData?.service_name || null, // 5.11.1.5
    tab0_status_description: dbData?.status_description || "", // 5.11.1.6
    tab0_change_description: dbData?.change_description || "", //  5.11.1.7
    tab0_service_list: dbData?.service_list || "", //  5.11.1.8
    tab0_other_info_list: dbData?.other_info_list || "", //  5.11.1.9
    tab0_full_org_info: dbData?.full_org_info || "", //  5.11.1.10
    tab0_full_user_info: dbData?.full_user_info || "", //  5.11.1.11
    tab0_copyright_description: dbData?.copyright_description || "", //  5.11.1.12
    tab0_is_active: dbData?.is_active || false,
    tab0_createdUser: userId || 0,
  };
  const initDB2 = {
    tab1_id: dbData?.id || 0,
    tab1_org_id: orgId,
    tab1_name: dbData?.name || "",
    tab1_short_name: dbData?.tab1_short_name || "",
    tab1_db_type: dbData?.db_type || "", // 5.11.2.2
    tab1_db_manage_system: dbData?.db_manage_system || "", // 5.11.2.3
    tab1_db_size: dbData?.db_size || 0, // 5.11.2.4
    tab1_db_rows_count: dbData?.db_db_rows_countsize || 0, // 5.11.2.5
    tab1_resource_location: dbData?.resource_location || "", //  5.11.2.6
    tab1_diagram_file_id: dbData?.diagram_file_id || null, //  5.11.2.7
    tab1_access_control_info: dbData?.access_control_info || "", //  5.11.2.8
    tab1_file_type_info: dbData?.file_type_info || "", //  5.11.2.9
    tab1_info_supply: dbData?.info_supply || "", //  5.11.2.10
    tab1_service_name: dbData?.service_name || "", //  5.11.2.11
    tab1_content_info_supply: dbData?.content_info_supply || "", //  5.11.2.12
    tab1_input_values: dbData?.input_values || "", //  5.11.2.13
    tab1_output_values: dbData?.output_values || "", //  5.11.2.14
    tab1_is_active: dbData?.is_active || false,
    tab1_createdUser: userId || 0,
  };
  const initialValues = {
    ...initDB,
    ...initDB1,
    ...initDB2,
  };

  const onSubmit = async (values: IDatabase) => {
    const data = {
      id: values?.id,
      org_id: values?.org_id,
      name: values?.name,
      description: values?.description,
      spec: values?.spec,
      spec_other: values?.spec_other,
      db_type: values?.db_type,
      db_type_other: values?.db_type_other,
      db_location: values?.db_location,
      db_location_other: values?.db_location_other,
      sector: values?.sector,
      sector_other: values?.sector_other,
      licence_type: values?.licence_type,
      licence_type_other: values?.licence_type_other,
      opendata_url: values?.opendata_url,
      table_count: Number(values?.table_count),
      start_date: values?.start_date,
      is_form: values?.is_form,
      is_active: values?.is_active,
      createdUser: values?.createdUser,
    };

    const response = await createDatabase(data);
    setLoading(true);
    if (response.status == "success") {
      window.location.reload();
      setStatus("success");
      setAlert("success");
      setOpen(false);
      setSidebarStatus(false);
      setLoading(false);
    } else {
      setStatus("error");
      setAlert("error");
      setLoading(false);
      setOpen(false);
      setSidebarStatus(false);
    }
    setLoading(false);
    setOpen(false);
    setSidebarStatus(false);
  };

  const getValidationSchema = () => {
    console.log('-----getValidationSchema------', step)
    switch (step) {
      case 0:
        return validationTab0Schema;
      case 1:
        return validationTab1Schema;
      case 2:
        return validationSchema;
      default:
        return validationSchema;
    }
  };

  // if (loading) return <Loader />;
  return (
    <Sidebar className="w-full" theme={sidebarTheme}>
      <Snackbar
        open={status == "success" || status == "error" ? true : false}
        autoHideDuration={2000}
        onClose={() => setStatus("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Box>
          {status == "success" ? (
            <Alert severity="success">Амжилттай хадгаллаа ... </Alert>
          ) : status == "error" ? (
            <Alert severity="error">Хадгалахад алдаа гарлаа ...</Alert>
          ) : null}
        </Box>
      </Snackbar>
      <div className=" overflow-x-auto">
        <Formik
          initialValues={initialValues}
          validationSchema={getValidationSchema}
          onSubmit={onSubmit}
        >
          {({ handleSubmit, values, setFieldValue, errors, validateForm, setFieldTouched, touched }) => {
            return (
              <form className="w-full" method="POST" onSubmit={handleSubmit}>
                <Input type="hidden" value={values?.id} />

                <Tabs value={step} onChange={async (e, newStep) => {
                  console.log('-----newStep, step------', newStep, step)
                  // if (newStep > step) {
                  //   const errors = await validateForm();
                  //   console.log('-----errors------', errors)
                  //   if (Object.keys(errors).length !== 0) return; // block
                  // }
                  setStep(newStep);
                }}>
                  <Tab label="Үйл ажиллагааны мэдээлэл">
                  </Tab>
                  <Tab label="Технологийн орчны мэдээлэл">
                  </Tab>
                  <Tab label="Мета өгөгдлийн мэдээлэл">
                  </Tab>
                </Tabs>

                {
                  step === 0 && (
                    <>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="5.11.1.1. Системийн нэр" />
                          <TooltipComponent content="Системийн нэр" />
                        </Box>
                        <InputComponent
                          type="text"
                          name="tab0_name"
                          label="Системийн нэр"
                          value={values?.tab0_name}
                          onChange={(e: any) => {
                            setFieldValue("tab0_name", e.target.value);
                          }}
                          errors={errors.tab0_name}
                        />
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="5.11.1.2. Системийн товч нэр" />
                          <TooltipComponent content="Системийн товч нэр" />
                        </Box>
                        <InputComponent
                          type="text"
                          name="tab0_short_name"
                          label="Системийн товч нэр"
                          value={values?.tab0_short_name}
                          onChange={(e: any) => {
                            setFieldValue("tab0_short_name", e.target.value);
                          }}
                          errors={errors.tab0_short_name}
                        />
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="5.11.1.3. Системийн домэйн нэр" />
                          <TooltipComponent content="Системийн домэйн нэр" />
                        </Box>
                        <InputComponent
                          type="text"
                          name="tab0_domain_name"
                          label="Системийн домэйн нэр"
                          value={values?.tab0_domain_name}
                          onChange={(e: any) => {
                            setFieldValue("tab0_domain_name", e.target.value);
                          }}
                          errors={errors.tab0_domain_name}
                        />
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="5.11.1.4. Зорилго, үйл ажиллагаа, хамрах хүрээ" />
                          <TooltipComponent content="Зорилго, үйл ажиллагаа, хамрах хүрээ" />
                        </Box>
                        <TextAreaComponent
                          type="text"
                          name="tab0_scope"
                          label="Зорилго, үйл ажиллагаа, хамрах хүрээ"
                          value={values?.tab0_scope}
                          onChange={(e: any) => {
                            setFieldValue("tab0_scope", e.target.value);
                          }}
                          errors={errors.tab0_scope}
                        />
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="5.11.1.5. Дотооддоо мөрдөж буй дүрэм, журам, шийдвэр" />
                          <TooltipComponent content="Дотооддоо мөрдөж буй дүрэм, журам, шийдвэр" />
                        </Box>
                        <FileComponent
                          label="Дотооддоо мөрдөж буй дүрэм, журам, шийдвэр"
                          name="file"
                          onChange={(fileData: any) => {
                            // setSelectedFile(fileData);
                          }}
                          value={values?.tab0_regulation_file_id}
                          desabled={false}
                        />
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="5.11.1.6. Сан шинээр үүсгэх, бүтцийн өөрчлөлт оруулсан, ашиглалтаас гаргасан мэдээлэл" />
                          <TooltipComponent content="Сан шинээр үүсгэх, бүтцийн өөрчлөлт оруулсан, ашиглалтаас гаргасан мэдээлэл" />
                        </Box>
                        <TextAreaComponent
                          type="text"
                          name="tab0_status_description"
                          label="Сан шинээр үүсгэх, бүтцийн өөрчлөлт оруулсан, ашиглалтаас гаргасан мэдээлэл"
                          value={values?.tab0_status_description}
                          onChange={(e: any) => {
                            setFieldValue("tab0_status_description", e.target.value);
                          }}
                          errors={errors.tab0_status_description}
                        />
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="5.11.1.7. Сан бүртдүүлэх ашиглах, солилцох үйл ажиллагаанд мөрдөж буй стандарт" />
                          <TooltipComponent content="Сан бүртдүүлэх ашиглах, солилцох үйл ажиллагаанд мөрдөж буй стандарт" />
                        </Box>
                        <TextAreaComponent
                          type="text"
                          name="tab0_change_description"
                          label="Сан бүртдүүлэх ашиглах, солилцох үйл ажиллагаанд мөрдөж буй стандарт"
                          value={values?.tab0_change_description}
                          onChange={(e: any) => {
                            setFieldValue("tab0_change_description", e.target.value);
                          }}
                          errors={errors.tab0_change_description}
                        />
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="5.11.1.8. Үзүүлэх үйлчилгээний жагсаалт" />
                          <TooltipComponent content="Үзүүлэх үйлчилгээний жагсаалт" />
                        </Box>
                        <div>
                          <ReactQuill
                            value={values?.tab0_service_list}
                            onChange={(content) => setFieldValue("tab0_service_list", content)}
                            onBlur={() => setFieldTouched("tab0_service_list", true)}
                          />
                          {errors.tab0_service_list && (
                            <p className="text-red-600 text-text-body-small mt-2 p-1">
                              {errors.tab0_service_list}
                            </p>
                          )}
                        </div>
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="5.11.1.9. Мэдээлэл цуглуулж, боловсруулж, ашиглаж буй мэдээлэл" />
                          <TooltipComponent content="Мэдээлэл цуглуулж, боловсруулж, ашиглаж буй мэдээлэл" />
                        </Box>
                        <div>
                          <ReactQuill
                            value={values?.tab0_other_info_list}
                            onChange={(content) => setFieldValue("tab0_other_info_list", content)}
                          />
                          {errors.tab0_other_info_list && (
                            <p className="text-red-600 text-text-body-small mt-2 p-1">
                              {errors.tab0_other_info_list}
                            </p>
                          )}
                        </div>
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="5.11.1.10. Харуцагч байгууллагын нэр, хаяг, утасны дугаар, цахим шуудан" />
                          <TooltipComponent content="Харуцагч байгууллагын нэр, хаяг, утасны дугаар, цахим шуудан" />
                        </Box>
                        <div>
                          <ReactQuill
                            value={values?.tab0_full_org_info}
                            onChange={(content) => setFieldValue("tab0_full_org_info", content)}
                          />
                          {errors.tab0_full_org_info && (
                            <p className="text-red-600 text-text-body-small mt-2 p-1">
                              {errors.tab0_full_org_info}
                            </p>
                          )}
                        </div>
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="5.11.1.11. Харуцсан ажилтны нэр, хаяг, утасны дугаар, цахим шуудан" />
                          <TooltipComponent content="Харуцсан ажилтны нэр, хаяг, утасны дугаар, цахим шуудан" />
                        </Box>
                        <div>
                          <ReactQuill
                            value={values?.tab0_full_user_info}
                            onChange={(content) => setFieldValue("tab0_full_user_info", content)}
                          />
                          {errors.tab0_full_user_info && (
                            <p className="text-red-600 text-text-body-small mt-2 p-1">
                              {errors.tab0_full_user_info}
                            </p>
                          )}
                        </div>
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="5.11.1.12. Програм хангамж, мэдээллийн сангийн зохиогчийн эрхийн мэдээлэл" />
                          <TooltipComponent content="Програм хангамж, мэдээллийн сангийн зохиогчийн эрхийн мэдээлэл" />
                        </Box>
                        <div>
                          <ReactQuill
                            value={values?.tab0_copyright_description}
                            onChange={(content) => setFieldValue("tab0_copyright_description", content)}
                          />
                          {errors.tab0_copyright_description && (
                            <p className="text-red-600 text-text-body-small mt-2 p-1">
                              {errors.tab0_copyright_description}
                            </p>
                          )}
                        </div>
                      </FormBox>
                    </>
                  )
                }

                {
                  step === 1 && (
                    <>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="5.11.2.1. Мэдээллийн сангийн нэр" />
                          <TooltipComponent content="Мэдээллийн сангийн нэр" />
                        </Box>
                        <InputComponent
                          type="text"
                          name="tab1_name"
                          label="Мэдээллийн сангийн нэр"
                          value={values?.tab1_name}
                          onChange={(e: any) => {
                            setFieldValue("tab1_name", e.target.value);
                          }}
                          errors={errors.tab1_name}
                        />
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="5.11.2.1. Мэдээллийн сангийн товч нэр" />
                          <TooltipComponent content="Мэдээллийн сангийн товч нэр" />
                        </Box>
                        <InputComponent
                          type="text"
                          name="tab1_short_name"
                          label="Мэдээллийн сангийн товч нэр"
                          value={values?.tab1_short_name}
                          onChange={(e: any) => {
                            setFieldValue("tab1_short_name", e.target.value);
                          }}
                          errors={errors.tab1_short_name}
                        />
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="5.11.2.2. Мэдээллийн сангийн төрөл" />
                          <TooltipComponent content="Мэдээллийн сангийн төрөл" />
                        </Box>
                        <SelectComponent
                          options={dbTypes}
                          label="Мэдээллийн сангийн төрөл"
                          name="tab1_db_type"
                          defaultValue={values?.tab1_db_type}
                          onChange={(e: any, value: any) => {
                            setFieldValue("tab1_db_type", value);
                          }}
                          errors={errors?.tab1_db_type}
                        />
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="5.11.2.3. Мэдээллийн сан удирдах системийн нэр" />
                          <TooltipComponent content="Мэдээллийн сан удирдах системийн нэр" />
                        </Box>
                        <InputComponent
                          type="text"
                          name="tab1_db_manage_system"
                          label="Мэдээллийн сан удирдах системийн нэр"
                          value={values?.tab1_db_manage_system}
                          onChange={(e: any) => {
                            setFieldValue("tab1_db_manage_system", e.target.value);
                          }}
                          errors={errors.tab1_db_manage_system}
                        />
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="5.11.2.4. Мэдээллийн сангийн хэмжээ" />
                          <TooltipComponent content="Мэдээллийн сангийн хэмжээ" />
                        </Box>
                        <InputComponent
                          type="number"
                          name="tab1_db_size"
                          value={values?.tab1_db_size}
                          label="Мэдээллийн сангийн хэмжээ"
                          onChange={(e: any) => {
                            setFieldValue("tab1_db_size", e.target.value);
                          }}
                          errors={errors?.tab1_db_size}
                        />
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="5.11.2.5. Мэдээллийн сан дан бичлэгийн тоо" />
                          <TooltipComponent content="Мэдээллийн сан дан бичлэгийн тоо" />
                        </Box>
                        <InputComponent
                          type="number"
                          name="tab1_db_rows_count"
                          value={values?.tab1_db_rows_count}
                          label="Мэдээллийн сан дан бичлэгийн тоо"
                          onChange={(e: any) => {
                            setFieldValue("tab1_db_rows_count", e.target.value);
                          }}
                          errors={errors?.tab1_db_rows_count}
                        />
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="5.11.2.6. Мэдээллийн сан, түүний нөөцийн байршил" />
                          <TooltipComponent content="Мэдээллийн сан, түүний нөөцийн байршил" />
                        </Box>
                        <InputComponent
                          type="text"
                          name="tab1_resource_location"
                          label="Мэдээллийн сан, түүний нөөцийн байршил"
                          value={values?.tab1_resource_location}
                          onChange={(e: any) => {
                            setFieldValue("tab1_resource_location", e.target.value);
                          }}
                          errors={errors.tab1_resource_location}
                        />
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="5.11.1.7. Мэдээллийн сангийн диаграм" />
                          <TooltipComponent content="Мэдээллийн сангийн диаграм" />
                        </Box>
                        <FileComponent
                          label="Мэдээллийн сангийн диаграм"
                          name="file"
                          onChange={(fileData: any) => {
                            // setSelectedFile(fileData);
                          }}
                          value={values?.tab1_diagram_file_id}
                          desabled={false}
                        />
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="5.11.2.8. Хандах эрхийн зохицуулалтын мэдээлэл, тайлбар" />
                          <TooltipComponent content="Хандах эрхийн зохицуулалтын мэдээлэл, тайлбар" />
                        </Box>
                        <div>
                          <ReactQuill
                            value={values?.tab1_access_control_info}
                            onChange={(content) => setFieldValue("tab1_access_control_info", content)}
                          />
                          {errors.tab1_access_control_info && (
                            <p className="text-red-600 text-text-body-small mt-2 p-1">
                              {errors.tab1_access_control_info}
                            </p>
                          )}
                        </div>
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="5.11.2.9. Мэдээллийн санд хадгалагдаж буй файлын төрлүүд" />
                          <TooltipComponent content="Мэдээллийн санд хадгалагдаж буй файлын төрлүүд" />
                        </Box>
                        <div>
                          <ReactQuill
                            value={values?.tab1_file_type_info}
                            onChange={(content) => setFieldValue("tab1_file_type_info", content)}
                          />
                          {errors.tab1_file_type_info && (
                            <p className="text-red-600 text-text-body-small mt-2 p-1">
                              {errors.tab1_file_type_info}
                            </p>
                          )}
                        </div>
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="5.11.2.10. Мэдээллийн хариуцагчаас үндсэн системд нийлүүлж буй мэдээлэл" />
                          <TooltipComponent content="Мэдээллийн хариуцагчаас үндсэн системд нийлүүлж буй мэдээлэл" />
                        </Box>
                        <div>
                          <ReactQuill
                            value={values?.tab1_info_supply}
                            onChange={(content) => setFieldValue("tab1_info_supply", content)}
                          />
                          {errors.tab1_info_supply && (
                            <p className="text-red-600 text-text-body-small mt-2 p-1">
                              {errors.tab1_info_supply}
                            </p>
                          )}
                        </div>
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="5.11.2.11. Сервисийн нэр" />
                          <TooltipComponent content="Сервисийн нэр" />
                        </Box>
                        <InputComponent
                          type="text"
                          name="tab1_service_name"
                          label="Сервисийн нэр"
                          value={values?.tab1_service_name}
                          onChange={(e: any) => {
                            setFieldValue("tab1_service_name", e.target.value);
                          }}
                          errors={errors.tab1_service_name}
                        />
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="5.11.2.12. Нийлүүлэх мэдээллийн агуулга" />
                          <TooltipComponent content="Нийлүүлэх мэдээллийн агуулга" />
                        </Box>
                        <div>
                          <ReactQuill
                            value={values?.tab1_content_info_supply}
                            onChange={(content) => setFieldValue("tab1_content_info_supply", content)}
                          />
                          {errors.tab1_content_info_supply && (
                            <p className="text-red-600 text-text-body-small mt-2 p-1">
                              {errors.tab1_content_info_supply}
                            </p>
                          )}
                        </div>
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="5.11.2.13. Оролтын утгууд (төрөл, утга, тайлбар)" />
                          <TooltipComponent content="Оролтын утгууд (төрөл, утга, тайлбар)" />
                        </Box>
                        <div>
                          <ReactQuill
                            value={values?.tab1_input_values}
                            onChange={(content) => setFieldValue("tab1_input_values", content)}
                          />
                          {errors.tab1_input_values && (
                            <p className="text-red-600 text-text-body-small mt-2 p-1">
                              {errors.tab1_input_values}
                            </p>
                          )}
                        </div>
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="5.11.2.14. Гаралтын утгууд (төрөл, утга, тайлбар)" />
                          <TooltipComponent content="Гаралтын утгууд (төрөл, утга, тайлбар)" />
                        </Box>
                        <div>
                          <ReactQuill
                            value={values?.tab1_output_values}
                            onChange={(content) => setFieldValue("tab1_output_values", content)}
                          />
                          {errors.tab1_output_values && (
                            <p className="text-red-600 text-text-body-small mt-2 p-1">
                              {errors.tab1_output_values}
                            </p>
                          )}
                        </div>
                      </FormBox>
                    </>
                  )
                }

                {
                  step === 2 && (
                    <>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="1. Хариуцдаг байгууллагын нэр" />
                          <TooltipComponent content="Хариуцдаг байгууллагын нэр" />
                        </Box>
                        <SelectComponent
                          options={orgData}
                          defaultValue={values.org_id}
                          desabled={true}
                          label="Хариуцдаг байгууллагын нэр"
                          name="org_id"
                          onChange={(e: any, value: any) => {
                            setFieldValue("org_id", value);
                          }}
                          errors={errors?.org_id}
                        />
                      </FormBox>
      
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="2. Өгөгдлийн сангийн нэр" />
                          <TooltipComponent content="Өгөгдлийн сангийн нэр" />
                        </Box>
                        <TextAreaComponent
                          type="text"
                          name="name"
                          label="Өгөгдлийн сангийн нэр"
                          value={values?.name}
                          onChange={(e: any) => {
                            setFieldValue("name", e.target.value);
                          }}
                          errors={errors.name}
                        />
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="3. Өгөгдлийн сангийн тухай ойлголт" />
                          <TooltipComponent content="Өгөгдлийн сангийн тухай ойлголт" />
                        </Box>
                        <TextAreaComponent
                          type="text"
                          name="description"
                          label="Өгөгдлийн сангийн тухай ойлголт"
                          value={values?.description}
                          onChange={(e: any) => {
                            setFieldValue("description", e.target.value);
                          }}
                          errors={errors.description}
                        />
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="4. Зориулалт" />
                          <TooltipComponent content="Зориулалт" />
                        </Box>
      
                        <MultiSelectComponent
                          options={specifications}
                          name="spec"
                          placeholder="Зориулалт  сонгох"
                          label="Зориулалт"
                          value={values.spec}
                          onChange={(e: any, value: any) => {
                            setFieldValue("spec", value);
                          }}
                          errors={errors.spec}
                        />
                      </FormBox>
      
                      <Box sx={{ ml: "2rem" }}>
                        {values?.spec?.includes(4) && (
                          <FormBox>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <LabelComponent label="4.1. Зориулалт бусад" />
                              <TooltipComponent content="Зориулалт бусад" />
                            </Box>
                            <InputComponent
                              type="text"
                              name="spec_other"
                              label="Зориулалт бусад"
                              value={values?.spec_other}
                              onChange={(e: any) => {
                                setFieldValue("spec_other", e.target.value);
                              }}
                              errors={errors.spec_other}
                            />
                          </FormBox>
                        )}
                      </Box>
      
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="5. Өгөгдлийн сангийн төрөл" />
                          <TooltipComponent content="Өгөгдлийн сангийн төрөл" />
                        </Box>
                        <SelectComponent
                          options={dbTypes}
                          label="Өгөгдлийн сангийн төрөл"
                          name="db_type"
                          defaultValue={values.db_type}
                          onChange={(e: any, value: any) => {
                            setFieldValue("db_type", value);
                          }}
                          errors={errors?.db_type}
                        />
                      </FormBox>
                      <Box sx={{ ml: "2rem" }}>
                        {values.db_type == 8 && (
                          <FormBox>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <LabelComponent label="5.1. Өгөгдлийн сангийн төрөл бусад:" />
                              <TooltipComponent content="Өгөгдлийн сангийн төрөл бусад:" />
                            </Box>
                            <InputComponent
                              type="text"
                              name="db_type_other"
                              value={values?.db_type_other}
                              label="Өгөгдлийн сан бусад"
                              onChange={(e: any, value: any) => {
                                setFieldValue("db_type_other", value);
                              }}
                              errors={errors?.db_type_other}
                            />
                          </FormBox>
                        )}
                      </Box>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="6. Салбар" />
                          <TooltipComponent content="Салбар" />
                        </Box>
                        <AutocompleteIntroduction
                          options={sectorOptions}
                          name="sector"
                          onchange={(e: any, newValue: any) => {
                            if (newValue == null) {
                              setFieldValue("sector", null);
                            } else {
                              setFieldValue("sector", newValue.id);
                            }
                          }}
                          values={values.sector}
                          errors={errors?.sector}
                        />
                      </FormBox>
      
                      <Box sx={{ ml: "2rem" }}>
                        {values.sector == "43" && (
                          <FormBox>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <LabelComponent label="6.1. Салбар бусад:" />
                              <TooltipComponent content="Салбар бусад:" />
                            </Box>
                            <InputComponent
                              type="text"
                              value={values?.sector_other}
                              name="sector_other"
                              label="Салбар бусад"
                              onChange={(e: any) => {
                                setFieldValue("sector_other", e.target.value);
                              }}
                              errors={errors?.sector_other}
                            />
                          </FormBox>
                        )}
                      </Box>
      
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="7. Өгөгдлийн сангийн байршил" />
                          <TooltipComponent content="Өгөгдлийн сангийн байршил" />
                        </Box>
                        <SelectComponent
                          options={dbLocation}
                          label="Өгөгдлийн сангийн байршил"
                          name="db_location"
                          defaultValue={values?.db_location}
                          onChange={(e: any, value: any) => {
                            setFieldValue("db_location", value);
                          }}
                          errors={errors?.db_location}
                        />
                      </FormBox>
      
                      <Box sx={{ ml: "2rem" }}>
                        {values.db_location == 5 && (
                          <FormBox>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <LabelComponent label="7.1. Өгөгдлийн сангийн байршил бусад:" />
                              <TooltipComponent content="Өгөгдлийн сангийн байршил бусад" />
                            </Box>
                            <InputComponent
                              type="text"
                              name="db_location_other"
                              value={values?.db_location_other}
                              label="Өгөгдлийн сангийн байршил бусад"
                              onChange={(e: any) => {
                                setFieldValue("db_location_other", e.target.value);
                              }}
                              errors={errors?.db_location_other}
                            />
                          </FormBox>
                        )}
                      </Box>
      
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="8. Нээлттэй өгөгдлийг ашиглах лицензийн төрөл" />
                          <TooltipComponent content="Нээлттэй өгөгдлийг ашиглах лицензийн төрөл" />
                        </Box>
                        <SelectComponent
                          options={licenceType}
                          label="Нээлттэй өгөгдлийг ашиглах лицензийн төрөл"
                          name="licence_type"
                          defaultValue={values?.licence_type}
                          onChange={(e: any, value: any) => {
                            setFieldValue("licence_type", value);
                          }}
                          errors={errors?.licence_type}
                        />
                      </FormBox>
      
                      <Box sx={{ ml: "2rem" }}>
                        {values.licence_type == "5" && (
                          <FormBox>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <LabelComponent label="8.1. Нээлттэй өгөгдлийг ашиглах лицензийн төрөл бусад" />
                              <TooltipComponent content="Нээлттэй өгөгдлийг ашиглах лицензийн төрөл бусад" />
                            </Box>
                            <InputComponent
                              value={values.licence_type_other}
                              type="text"
                              name="licence_type_other"
                              label="Нээлттэй өгөгдлийг ашиглах лицензийн төрөл бусад"
                              onChange={(e: any) => {
                                setFieldValue("licence_type_other", e.target.value);
                              }}
                              errors={errors?.licence_type_other}
                            />
                          </FormBox>
                        )}
                      </Box>
      
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="9. Тухайн өгөгдлийг нээлттэй өгөгдлийн системээс татан авч үзэж болох цахим хуудасны хаяг" />
                          <TooltipComponent content="Тухайн өгөгдлийг нээлттэй өгөгдлийн системээс татан авч үзэж болох цахим хуудасны хаяг" />
                        </Box>
                        <InputComponent
                          type="url"
                          name="opendata_url"
                          label="Цахим хуудасны хаяг"
                          value={values.opendata_url}
                          onChange={(e: any) => {
                            setFieldValue("opendata_url", e.target.value);
                          }}
                          errors={errors?.opendata_url}
                        />
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="10. Өгөгдлийн санг анх нэвтрүүлсэн он" />
                          <TooltipComponent content="Өгөгдлийн санг анх нэвтрүүлсэн он" />
                        </Box>
                        <InputComponent
                          type="number"
                          name="start_date"
                          label="YYYY"
                          value={values?.start_date}
                          onChange={(e: any) => {
                            setFieldValue("start_date", e.target.value);
                          }}
                          errors={errors?.start_date}
                        />
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="11. Хүснэгтийн тоо" />
                          <TooltipComponent content="Хүснэгтийн тоо" />
                        </Box>
                        <InputComponent
                          type="number"
                          name="table_count"
                          value={values?.table_count}
                          label="Хүснэгтийн тоо"
                          onChange={(e: any) => {
                            setFieldValue("table_count", e.target.value);
                          }}
                          errors={errors?.table_count}
                        />
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="12. Маягттай эсэх" />
                          <TooltipComponent content="Маягттай эсэх" />
                        </Box>
                        <SwitchComponent
                          name="is_form"
                          label="Маягттай эсэх"
                          defaultChecked={values?.is_form}
                          onChange={(e) => {
                            setFieldValue("is_form", e.target.checked);
                          }}
                        />
                      </FormBox>
      
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="13. Идэвхтэй эсэх" />
                          <TooltipComponent content="Идэвхтэй эсэх" />
                        </Box>
                        <SwitchComponent
                          name="is_active"
                          label="Идэвхтэй эсэх"
                          defaultChecked={values?.is_active}
                          onChange={(e) => {
                            setFieldValue("is_active", e.target.checked);
                          }}
                        />
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="14. Хувилбар" />
                          <TooltipComponent content="Хувилбар" />
                        </Box>
                        <InputComponent
                          type="text"
                          name="version"
                          label="Хувилбар"
                          value={values?.version}
                          onChange={(e: any) => {
                            setFieldValue("version", e.target.value);
                          }}
                        />
                      </FormBox>
      
                      {/* <div className="flex justify-end p-3">
                        <Button
                          className="text-primary-default bg-primary-medium bg-opacity-50 hover:bg-tertirary-background hover:text-tertirary-default"
                          variant="contained"
                          color="success"
                          type="submit"
                          size="small"
                        >
                          Хадгалах
                        </Button>
                      </div> */}
                    </>
                  )
                }

              </form>
            );
          }}
        </Formik>
      </div>
    </Sidebar>
  );
};
export default CreateDatabase;
