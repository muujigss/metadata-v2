import { createDatabase } from "@/services/DatabaseService";
import {
  useGetDbLocation,
  useGetDbType,
  useGetLicence,
  useGetOrgs,
  useGetSectors,
  useGetSpecification,
} from "@/utils/customHooks";
import { Alert, Button, Input, Box, Snackbar } from "@mui/material";
import { Sidebar } from "flowbite-react";
import { Formik } from "formik";
import { useState } from "react";
import Loader from "../../Loader";
import { validationSchema } from "./DBValidationSchema";
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

  let initDB = {
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
          initialValues={initDB}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ handleSubmit, values, setFieldValue, errors }) => {
            return (
              <form className="w-full" method="POST" onSubmit={handleSubmit}>
                <Input type="hidden" value={values?.id} />
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
    </Sidebar>
  );
};
export default CreateDatabase;
