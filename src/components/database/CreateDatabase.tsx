import { createDatabase } from "@/services/DatabaseService";
import {
  useGetDbLocation,
  useGetDbType,
  useGetLicence,
  useGetOrgs,
  useGetSectors,
  useGetSpecification,
} from "@/utils/customHooks";
import { Alert, Button } from "@mui/material";
import { Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import Loader from "../Loader";
import InputComponent from "../admin/form/InputComponent";
import MultiSelectComponent from "../admin/form/MultiSelectComponent";
import SelectComponent from "../admin/form/SelectComponent";
import SwitchComponent from "../admin/form/SwitchComponent";

const CreateDatabase = () => {
  const { data: dbTypes } = useGetDbType();
  const { data: specifications } = useGetSpecification();
  const { data: organizations } = useGetOrgs();
  const { data: sector } = useGetSectors();
  const { data: dbLocation } = useGetDbLocation();
  const { data: licenceType } = useGetLicence();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const orgData = organizations?.map((org: any) => {
    return { name: org.org_name, id: org.org_id };
  });

  const sectorOptions = sector?.map((sector: any) => {
    return { name: sector.name, id: sector.code };
  });

  if (loading) return <Loader />;
  return (
    <div className="bg-white px-4 py-4 w-full">
      <p className="text-text-title-medium py-2">Өгөгдлийн сан нэмэх</p>
      <Formik
        initialValues={{
          organization_id: "",
          db_name: "",
          db_description: "",
          specification: [] as number[],
          specification_other: "",
          db_type: null,
          db_type_other: "",
          db_location: null,
          db_location_other: "",
          sector: "",
          sector_other: "",
          source: null,
          source_other: "",
          opendata_licence_type: "",
          opendata_licence_type_other: "",
          opendata_url: "",
          table_count: null,
          start_date: null,
          is_form: false,
        }}
        validationSchema={Yup.object({
          organization_id: Yup.string().required("Байгууллагаа сонгоно уу."),
          db_name: Yup.string().required("Өгөгдлийн сангийн нэр оруулна уу."),
          db_description: Yup.string().required(
            "Өгөгдлийн сангийн тайлбар оруулна уу."
          ),
          specification: Yup.array()
            .of(Yup.number().required("Зориулалтын төрөл сонгоно уу."))
            .min(1, "Зориулалтын төрөл сонгоно уу.")
            .required("Зориулалтын төрөл сонгоно уу."),
          specification_other: Yup.string().when(
            "specification",
            (specification) => {
              const sp = specification?.map((spec: any) => {
                return spec.includes(4);
              })[0];

              if (sp) {
                return Yup.string().required("Бусад зориулалт бичнэ үү.");
              }
              return Yup.string();
            }
          ),
          db_type: Yup.number().required("Өгөгдлийн сангийн төрөл сонгоно уу."),
          db_type_other: Yup.string().when("db_type", (dbType) => {
            if (dbType.includes(8)) {
              return Yup.string().required(
                "Өгөгдлийн сангийн төрөл бичнэ үү sss."
              );
            }
            return Yup.string();
          }),
          db_location: Yup.number().required(
            "Өгөгдлийн сангийн байршил сонгоно уу."
          ),
          db_location_other: Yup.string().when("db_location", (dbLocation) => {
            if (dbLocation.includes(5)) {
              return Yup.string().required(
                "Өгөгдлийн сангийн байршил бичнэ үү."
              );
            }
            return Yup.string();
          }),
          sector: Yup.string().required("Салбар сонгоно уу."),
          sector_other: Yup.string().when("sector", (sector) => {
            if (sector.includes("s43")) {
              return Yup.string().required("Салбар бичнэ үү.");
            }
            return Yup.string();
          }),
          opendata_licence_type: Yup.string().required(
            "Нээлттэй өгөгдлийг ашиглах лицензийн төрөл сонгоно уу."
          ),
          opendata_licence_type_other: Yup.string().when(
            "opendata_licence_type",
            (openDataLicence) => {
              if (openDataLicence.includes("5")) {
                return Yup.string().required(
                  "Нээлттэй өгөгдлийг ашиглах лицензийн төрөл бичнэ үү."
                );
              }
              return Yup.string();
            }
          ),
          opendata_url: Yup.string().required(
            "Нээлттэй өгөгдлийн URL оруулна уу."
          ),
          start_date: Yup.date().required(
            "Өгөгдлийн санг нэвтрүүлсэн огноо оруулна уу."
          ),
          table_count: Yup.number().required("Хүснэгтийн тоо оруулна уу."),
        })}
        onSubmit={async (values) => {
          setLoading(true);
          const data = {
            organization_id: values?.organization_id,
            db_name: values?.db_name,
            db_description: values?.db_description,
            specification: values?.specification,
            specification_other: values?.specification_other,
            db_type: values?.db_type,
            db_type_other: values?.db_type_other,
            db_location: values?.db_location,
            db_location_other: values?.db_location_other,
            sector: values?.sector,
            sector_other: values?.sector_other,
            source: values?.source,
            source_other: values?.source_other,
            opendata_licence_type: values?.opendata_licence_type,
            opendata_licence_type_other: values?.opendata_licence_type_other,
            opendata_url: values?.opendata_url,
            table_count: values?.table_count,
            start_date: values?.start_date,
            is_form: values?.is_form,
          };

          const response = await createDatabase(data);

          if (response.status == "success") {
            setStatus("success");
          } else {
            setStatus("error");
          }
          setLoading(false);
        }}
      >
        {({ handleSubmit, values, setFieldValue, errors }) => {
          return (
            <form className="w-full" method="POST" onSubmit={handleSubmit}>
              {status == "success" ? (
                <Alert severity="success">Амжилттай хадгаллаа ... </Alert>
              ) : status == "error" ? (
                <Alert severity="error">Хадгалахад алдаа гарлаа ...</Alert>
              ) : null}
              <div className="grid grid-cols-3 w-full gap-4 py-2">
                <SelectComponent
                  options={orgData}
                  label="Байгууллага"
                  name="organization_id"
                  onChange={(e: any) => {
                    setFieldValue("organization_id", e.target.value);
                  }}
                  errors={errors?.organization_id}
                />
                <InputComponent
                  type="text"
                  name="db_name"
                  label="Өгөгдлийн сангийн нэр"
                  defaultValue={values.db_name}
                  onChange={(e: any) => {
                    setFieldValue("db_name", e.target.value);
                  }}
                  errors={errors.db_name}
                />
                <InputComponent
                  type="text"
                  name="db_description"
                  label="Тайлбар"
                  defaultValue={values.db_description}
                  onChange={(e: any) => {
                    setFieldValue("db_description", e.target.value);
                  }}
                  errors={errors.db_description}
                />
                <MultiSelectComponent
                  options={specifications}
                  name="specification"
                  label="Зориулалтын төрөл"
                  value={values.specification}
                  onChange={(e: any) => {
                    setFieldValue("specification", e.target.value);
                  }}
                  errors={errors.specification}
                />
                {values?.specification?.includes(4) && (
                  <InputComponent
                    type="text"
                    name="specification_other"
                    label="Зориулалт бусад"
                    onChange={(e: any) => {
                      setFieldValue("specification_other", e.target.value);
                    }}
                    errors={errors.specification_other}
                  />
                )}

                <SelectComponent
                  options={dbTypes}
                  label="Өгөгдлийн сангийн төрөл"
                  name="db_type"
                  onChange={(e: any) => {
                    setFieldValue("db_type", e.target.value);
                  }}
                  errors={errors?.db_type}
                />
                {values.db_type == 8 && (
                  <InputComponent
                    type="text"
                    name="db_type_other"
                    label="Өгөгдлийн сан бусад"
                    onChange={(e: any) => {
                      setFieldValue("db_type_other", e.target.value);
                    }}
                    errors={errors?.db_type_other}
                  />
                )}
                <SelectComponent
                  options={sectorOptions}
                  label="Салбар"
                  name="sector"
                  onChange={(e: any) => {
                    setFieldValue("sector", e.target.value);
                  }}
                  errors={errors?.sector}
                />
                {values.sector == "s43" && (
                  <InputComponent
                    type="text"
                    name="sector_other"
                    label="Салбар бусад"
                    onChange={(e: any) => {
                      setFieldValue("sector_other", e.target.value);
                    }}
                    errors={errors?.sector_other}
                  />
                )}
                <SelectComponent
                  options={dbLocation}
                  label="Өгөгдлийн сангийн байршил"
                  name="db_location"
                  onChange={(e: any) => {
                    setFieldValue("db_location", e.target.value);
                  }}
                  errors={errors?.db_location}
                />
                {values.db_location == 5 && (
                  <InputComponent
                    type="text"
                    name="db_location_other"
                    label="Өгөгдлийн сангийн байршил бусад"
                    onChange={(e: any) => {
                      setFieldValue("db_location_other", e.target.value);
                    }}
                    errors={errors?.db_location_other}
                  />
                )}
                <SelectComponent
                  options={licenceType}
                  label="Нээлттэй өгөгдлийг ашиглах лицензийн төрөл"
                  name="opendata_licence_type"
                  onChange={(e: any) => {
                    setFieldValue("opendata_licence_type", e.target.value);
                  }}
                  errors={errors?.opendata_licence_type}
                />
                {values.opendata_licence_type == "5" && (
                  <InputComponent
                    type="text"
                    name="opendata_licence_type_other"
                    label="Нээлттэй өгөгдлийг ашиглах лицензийн төрөл бусад"
                    onChange={(e: any) => {
                      setFieldValue(
                        "opendata_licence_type_other",
                        e.target.value
                      );
                    }}
                    errors={errors?.opendata_licence_type_other}
                  />
                )}

                <InputComponent
                  type="url"
                  name="opendata_url"
                  label="Тухайн өгөгдлийг нээлттэй өгөгдлийн системээс татан авч үзэж болох цахим хуудасны хаяг"
                  onChange={(e: any) => {
                    setFieldValue("opendata_url", e.target.value);
                  }}
                  errors={errors?.opendata_url}
                />
                <InputComponent
                  type="date"
                  name="start_date"
                  label="Өгөгдлийн санг анх нэвтрүүлсэн он"
                  onChange={(e: any) => {
                    setFieldValue("start_date", e.target.value);
                  }}
                  errors={errors?.start_date}
                />

                <InputComponent
                  type="number"
                  name="table_count"
                  label="Хүснэгтийн тоо"
                  onChange={(e: any) => {
                    setFieldValue("table_count", e.target.value);
                  }}
                  errors={errors?.table_count}
                />
                <SwitchComponent
                  name="is_form"
                  label="Маягттай эсэх"
                  defaultChecked={values?.is_form}
                  onChange={(e) => {
                    setFieldValue("is_form", e.target.checked);
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
export default CreateDatabase;
