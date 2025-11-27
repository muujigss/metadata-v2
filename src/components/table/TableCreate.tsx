import { IDatabase } from "@/interfaces/IDatabase";
import { ITable } from "@/interfaces/ITable";
import { insertTable, updateTable } from "@/services/TableService";
import {
  useGetLicence,
  useGetOrgs,
  useGetSecurityLevels,
  useGetSources,
} from "@/utils/customHooks";
import { Alert, Box, Button } from "@mui/material";
import { Form, Formik } from "formik";
import { useState } from "react";
import Loader from "../Loader";
import { validationSchema } from "./TableValidationSchema";
import {
  InputComponent,
  MultiSelectComponent,
  SelectComponent,
  SwitchComponent,
  TextAreaComponent,
} from "../admin/form";
import LabelComponent from "../admin/form/LabelComponent";
import moment from "moment";
const TableCreate = ({
  dbId,
  setTabStatus,
  tblId,
  setSidebarStatus,
  tblData,
  sidebarStatus,
  setAlert,
}: {
  dbId: number;
  setTabStatus?: any;
  tblId?: number;
  setSidebarStatus?: any;
  tblData?: ITable;
  sidebarStatus?: boolean;
  setAlert?: any;
}) => {
  const { data: organizations } = useGetOrgs();
  const { data: sources } = useGetSources();
  const { data: security_levels } = useGetSecurityLevels();
  const { data: licenceType } = useGetLicence();

  const [loading, setLoading] = useState(false);
  // const [status, setStatus] = useState("");

  const orgData = organizations?.map((org: any) => {
    return { name: org.org_name, id: org.org_id };
  });

  const sourceData =
    tblData?.source &&
    tblData?.source?.map((source: any) => {
      return +source.id;
    });
  const securityLevelData =
    tblData?.security_level &&
    tblData?.security_level?.map((level: any) => {
      return +level?.id;
    });
  const opendataType = tblData && +tblData?.opendata_licence_type;

  let initTable: any = {
    tbl_id: 0,
    db_id: dbId,
    form_id: 0,
    tbl_code: "",
    tbl_name: tblData?.tbl_name || "",
    table_description: tblData?.table_description || "",
    source: sourceData || [],
    source_other: tblData?.source_other || "",
    security_level: securityLevelData || ([] as number[]),
    opendata_licence_type: opendataType || "",
    opendata_licence_type_other: tblData?.opendata_licence_type_other || "",
    opendata_licence_url: tblData?.opendata_licence_url || "",
    started_date: moment(tblData?.started_date).format("YYYY-MM-DD") || null,
    created_date: "",
    updated_date: "",
    created_user: 0,
    updated_user: 0,
    enabled: tblData?.enabled || true,
    indicators: [],
    database: {} as IDatabase,
  };

  if (loading) return <Loader />;

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      const {
        tbl_code,
        table_description,
        tbl_name,
        db_id,
        form_id,
        source,
        source_other,
        security_level,
        opendata_licence_type,
        opendata_licence_type_other,
        opendata_licence_url,
        enabled,
        started_date,
      } = values;

      const data: any = {
        tbl_id: values?.tbl_id,
        db_id,
        form_id,
        tbl_code,
        tbl_name,
        table_description,
        source,
        source_other,
        security_level,
        opendata_licence_type,
        opendata_licence_type_other,
        opendata_licence_url,
        started_date,
        enabled,
      };

      let response;
      if (sidebarStatus) {
        response = await updateTable(data, tblId);
      } else {
        response = await insertTable(data);
      }

      if (response.status == "success") {
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
    } catch (error) {
      console.log(error);
      setAlert("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white px-4 py-4 w-full">
      <Formik
        initialValues={initTable}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, errors }) => {
          return (
            <Form className="w-full">
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
                  options={orgData}
                  label="Өгөгдлийн сан"
                  desabled={true}
                  name="db_id"
                  defaultValue={values.db_id}
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
                <LabelComponent label="Хүснэгтийн нэр:" />
                <InputComponent
                  type="text"
                  name="tbl_name"
                  label="Хүснэгтийн нэр"
                  value={values.tbl_name}
                  onChange={(e: any) => {
                    setFieldValue("tbl_name", e.target.value);
                  }}
                  errors={errors.tbl_name}
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
                <LabelComponent label="Хүснэгтийн тухай ойлголт:" />
                <TextAreaComponent
                  label="Хүснэгтийн тухай ойлголт"
                  type="text"
                  name="table_description"
                  value={values.table_description}
                  onChange={(e: any) => {
                    setFieldValue("table_description", e.target.value);
                  }}
                  errors={errors.table_description}
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
                <LabelComponent label="Анхан шатны мэдээлэгч эх үүсвэр:" />
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
              </Box>
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
                  <LabelComponent label="Анхан шатны мэдээлэгч эх үүсвэр бусад:" />
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
                <LabelComponent label="Нээлттэй өгөгдлийг ашиглах лицензийн төрөл:" />
                <SelectComponent
                  options={licenceType}
                  label="Нээлттэй өгөгдлийг ашиглах лицензийн төрөл"
                  name="opendata_licence_type"
                  defaultValue={values.opendata_licence_type}
                  onChange={(e: any, newValue: any) => {
                    setFieldValue("opendata_licence_type", newValue);
                  }}
                  errors={errors?.opendata_licence_type}
                />
              </Box>
              {values.opendata_licence_type == "5" && (
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
                  <LabelComponent label="Нээлттэй өгөгдлийг ашиглах лицензийн төрөл бусад:" />
                  <InputComponent
                    type="text"
                    label="Нээлттэй өгөгдлийг ашиглах лицензийн төрөл бусад"
                    name="opendata_licence_type_other"
                    value={values.opendata_licence_type_other}
                    onChange={(e: any) => {
                      setFieldValue(
                        "opendata_licence_type_other",
                        e.target.value
                      );
                    }}
                    errors={errors?.opendata_licence_type_other}
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
                <LabelComponent label="Тухайн өгөгдлийг нээлттэй өгөгдлийн системээс татан авч үзэж болох цахим хуудасны хаяг:" />
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
                <LabelComponent label=" Хүснэгт үүсгэсэн огноо:" />
                <InputComponent
                  type="date"
                  label="Хүснэгт үүсгэсэн огноо"
                  name="started_date"
                  value={values.started_date}
                  onChange={(e: any) => {
                    setFieldValue("started_date", e.target.value);
                  }}
                  errors={errors?.started_date}
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
                <LabelComponent label="Идэвхтэй эсэх" />
                <SwitchComponent
                  name="enabled"
                  label="Идэвхтэй эсэх"
                  defaultChecked={values.enabled}
                  onChange={(e: any) => {
                    setFieldValue("enabled", e.target.checked);
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
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
export default TableCreate;
