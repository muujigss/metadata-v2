import { IDatabase } from "@/interfaces/IDatabase";
import { ITable } from "@/interfaces/ITable";
import { insertTable, updateTable } from "@/services/TableService";
import {
  useGetLicence,
  useGetSecurityLevels,
  useGetSources,
} from "@/utils/customHooks";
import { Box, Button, Input } from "@mui/material";
import { Form, Formik } from "formik";
import moment from "moment";
import { useState } from "react";
import {
  InputComponent,
  MultiSelectComponent,
  SelectComponent,
  SwitchComponent,
  TextAreaComponent,
} from "../formComponents";
import FormBox from "../formComponents/FormBox";
import LabelComponent from "../formComponents/LabelComponent";
import Loader from "../../Loader";
import { validationSchema } from "./TableValidationSchema";
import TooltipComponent from "../formComponents/TooltipComponent";
const TableCreate = ({
  dbId,
  tblId,
  setSidebarStatus,
  tblData,
  sidebarStatus,
  setAlert,
  setOpen,
  database,
}: {
  dbId: number;
  tblId?: number;
  setSidebarStatus?: any;
  tblData?: ITable;
  sidebarStatus?: boolean;
  setAlert?: any;
  setOpen?: any;
  database?: IDatabase;
}) => {
  const { data: sources } = useGetSources();
  const { data: security_levels } = useGetSecurityLevels();
  const { data: licenceType } = useGetLicence();
  const [loading, setLoading] = useState(false);

  const sourceData =
    tblData?.source &&
    tblData?.source?.map((source: { id: string }) => {
      return +source.id;
    });
  const securityLevelData =
    tblData?.security_level &&
    tblData?.security_level?.map((level: { id: string }) => {
      return +level?.id;
    });
  const opendataType = tblData && +tblData?.licence_type;

  let initTable: any = {
    id: tblData?.id || null,
    db_id: dbId,
    form_id: 0,
    code: tblData?.code || "",
    name: tblData?.name || "",
    description: tblData?.description || "",
    source: sourceData || [],
    source_other: tblData?.source_other || "",
    security_level: securityLevelData || ([] as number[]),
    licence_type: opendataType || "",
    licence_type_other: tblData?.licence_type_other || "",
    opendata_licence_url: tblData?.opendata_licence_url || "",
    started_date: tblData?.started_date || null,
    created_date: "",
    updated_date: "",
    created_user: 0,
    updated_user: 0,
    is_active: tblData?.is_active || false,
    version: tblData?.version || "",
    indicators: [],
    database: tblData?.database || ({} as IDatabase),
  };

  if (loading) return <Loader />;

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      const data: ITable = {
        id: values?.id,
        db_id: values?.db_id,
        form_id: values?.form_id,
        code: values?.code,
        name: values?.name,
        description: values?.description,
        source: values?.source,
        source_other: values?.source_other,
        security_level: values?.security_level,
        licence_type: values?.licence_type,
        licence_type_other: values?.licence_type_other,
        opendata_licence_url: values?.opendata_licence_url,
        started_date: values?.started_date,
        is_active: values?.is_active,
        version: values?.version,
      };
      const response = await insertTable(data);
      // if (sidebarStatus) {
      //   response = await updateTable(data, tblId);
      // } else {
      //   response = await insertTable(data);
      // }
      if (response.status == "success") {
        if (sidebarStatus) {
          setAlert("success");
          setSidebarStatus(false);
          setOpen(false);
          window.location.reload();
        } else {
          setAlert("success");
          setOpen(false);
          window.location.reload();
        }
      } else {
        setAlert("error");
        setSidebarStatus(false);
      }
    } catch (error) {
      console.log(error);
      setAlert("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white px-4 py-4 overflow-x-auto">
      <Formik
        initialValues={initTable}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, errors }) => {
          return (
            <Form className="w-full">
              <Input type="hidden" name="id" value={tblData?.id} />
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="1. Өгөгдлийн сан:" />
                  <TooltipComponent content="Өгөгдлийн сан сонгох" />
                </Box>
                <SelectComponent
                  options={[database || tblData?.database]}
                  label="Өгөгдлийн сан"
                  desabled={true}
                  name="db_id"
                  defaultValue={values.db_id}
                  onChange={(e: any, newValue: any) => {
                    setFieldValue("db_id", newValue);
                  }}
                  errors={errors?.db_id}
                />
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="2. Хүснэгтийн код:" />
                  <TooltipComponent content="Хүснэгтийн код" />
                </Box>
                <InputComponent
                  type="text"
                  name="code"
                  label="Хүснэгтийн код"
                  value={values.code}
                  onChange={(e: any) => {
                    setFieldValue("code", e.target.value);
                  }}
                  errors={errors.code}
                />
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="3. Хүснэгтийн нэр:" />
                  <TooltipComponent content="Хүснэгтийн нэр" />
                </Box>
                <InputComponent
                  type="text"
                  name="name"
                  label="Хүснэгтийн нэр"
                  value={values.name}
                  onChange={(e: any) => {
                    setFieldValue("name", e.target.value);
                  }}
                  errors={errors.name}
                />
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="4. Хүснэгтийн тухай ойлголт:" />
                  <TooltipComponent content="Хүснэгтийн тухай ойлголт" />
                </Box>
                <TextAreaComponent
                  label="Хүснэгтийн тухай ойлголт"
                  type="text"
                  name="description"
                  value={values.description}
                  onChange={(e: any) => {
                    setFieldValue("description", e.target.value);
                  }}
                  errors={errors.description}
                />
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="5. Анхан шатны мэдээлэгч эх үүсвэр:" />
                  <TooltipComponent content="Анхан шатны мэдээлэгч эх үүсвэр" />
                </Box>
                <MultiSelectComponent
                  options={sources}
                  name="source"
                  label="Анхан шатны мэдээлэгч эх үүсвэр"
                  value={values.source}
                  onChange={(event: any, newValue: any) => {
                    setFieldValue("source", newValue);
                  }}
                  errors={errors.source}
                />
              </FormBox>
              <Box sx={{ ml: "2rem" }}>
                {values?.source?.includes(5) && (
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
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <LabelComponent label="5.1. Анхан шатны мэдээлэгч эх үүсвэр бусад:" />
                      <TooltipComponent content="Анхан шатны мэдээлэгч эх үүсвэр бусад" />
                    </Box>
                    <InputComponent
                      type="text"
                      label="Анхан шатны мэдээлэгч эх үүсвэр бусад"
                      name="source_other"
                      value={values.source_other}
                      onChange={(e: any) => {
                        setFieldValue("source_other", e.target.value);
                      }}
                      errors={errors.source_other}
                    />
                  </Box>
                )}
              </Box>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="6. Нууцын зэрэглэл:" />
                  <TooltipComponent content="Нууцын зэрэглэл" />
                </Box>
                <MultiSelectComponent
                  options={security_levels}
                  name="security_level"
                  label="Нууцын зэрэглэл"
                  value={values.security_level}
                  onChange={(e: any, newValue: any) => {
                    setFieldValue("security_level", newValue);
                  }}
                  errors={errors.security_level}
                />
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="7. Нээлттэй өгөгдлийг ашиглах лицензийн төрөл:" />
                  <TooltipComponent content="Нээлттэй өгөгдлийг ашиглах лицензийн төрөл" />
                </Box>
                <SelectComponent
                  options={licenceType}
                  label="Нээлттэй өгөгдлийг ашиглах лицензийн төрөл"
                  name="licence_type"
                  defaultValue={values.licence_type}
                  onChange={(e: any, newValue: any) => {
                    setFieldValue("licence_type", newValue);
                  }}
                  errors={errors?.licence_type}
                />
              </FormBox>
              <Box sx={{ ml: "2rem" }}>
                {values.licence_type == "5" && (
                  <FormBox>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <LabelComponent label="7.1. Нээлтэй өгөгдлийг ашиглах лицензийн төрөл бусад:" />
                      <TooltipComponent content="Нээлттэй өгөгдлийг ашиглах лицензийн төрөл бусад" />
                    </Box>
                    <InputComponent
                      type="text"
                      label="Нээлттэй өгөгдлийг ашиглах лицензийн төрөл бусад"
                      name="licence_type_other"
                      value={values.licence_type_other}
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
                  <LabelComponent label="8. Тухайн өгөгдлийг нээлттэй өгөгдлийн системээс татан авч үзэж болох цахим хуудасны хаяг:" />
                  <TooltipComponent content="Тухайн өгөгдлийг нээлттэй өгөгдлийн системээс татан авч үзэж болох цахим хуудасны хаяг" />
                </Box>
                <InputComponent
                  type="text"
                  label="Тухайн өгөгдлийг нээлттэй өгөгдлийн системээс татан авч үзэж болох цахим хуудасны хаяг"
                  name="opendata_licence_url"
                  value={values.opendata_licence_url}
                  onChange={(e: any) => {
                    setFieldValue("opendata_licence_url", e.target.value);
                  }}
                  errors={errors?.opendata_licence_url}
                />
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="9. Хүснэгт үүсгэсэн огноо:" />
                  <TooltipComponent content="Хүснэгт үүсгэсэн огноо" />
                </Box>
                <InputComponent
                  type="number"
                  name="started_date"
                  label="YYYY"
                  value={values?.started_date}
                  onChange={(e: any) => {
                    setFieldValue("started_date", e.target.value);
                  }}
                  errors={errors?.started_date}
                />
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="10. Идэвхтэй эсэх" />
                  <TooltipComponent content="Идэвхтэй эсэх" />
                </Box>
                <SwitchComponent
                  name="is_active"
                  label="Идэвхтэй эсэх"
                  defaultChecked={values.is_active}
                  onChange={(e: any) => {
                    setFieldValue("is_active", e.target.checked);
                  }}
                />
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="11. Хувилбар" />
                  <TooltipComponent content="Хувилбар" />
                </Box>
                <InputComponent
                  name="version"
                  type="text"
                  label="Хувилбар"
                  value={values.version}
                  onChange={(e: any) =>
                    setFieldValue("version", e.target.value)
                  }
                  errors={errors.version}
                />
              </FormBox>
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
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
export default TableCreate;
