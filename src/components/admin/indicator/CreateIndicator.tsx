import {
  FormBox,
  InputComponent,
  LabelComponent,
  SelectComponent,
  SwitchComponent,
  TextAreaComponent,
} from "@/components/admin/formComponents";
import { IIndicator } from "@/interfaces/IIndicators";
import {
  createIndicatorService,
  getIndicatorListByTblId,
  getPrevIndicator,
} from "@/services/IndicatorService";
import {
  useGetFrequencies,
  useGetSecurityLevels,
  useGetUnit,
  useGetValueTypes,
} from "@/utils/customHooks";
import { Alert, Box, Button, Input } from "@mui/material";
import { Form, Formik } from "formik";
import { useState } from "react";
import Loader from "../../Loader";

import { ITable } from "@/interfaces/ITable";
import {
  getTable,
  getTablesByDB,
  getTablesByUser,
} from "@/services/TableService";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useSearchParams } from "next/navigation";
import { validationSchema } from "./IndicatorValidationSchema";
import Timer2LineIcon from "remixicon-react/Timer2LineIcon";
import AutocompleteIntroduction from "../form/SearchSelectComponent";
import TooltipComponent from "../formComponents/TooltipComponent";

const CreateIndicator = ({
  tblId,
  indId,
  setOpen,
  inData,
  setAlert,
  isEdit,
}: {
  tblId: number;
  indId?: number;
  setOpen?: (open: boolean) => {};
  inData?: IIndicator;
  setAlert?: any;
  isEdit?: boolean;
}) => {
  const { data: security_levels } = useGetSecurityLevels();
  const { data: frequencies } = useGetFrequencies();
  const { data: units } = useGetUnit();
  const { data: valueTypes } = useGetValueTypes();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTableId = Number(searchParams.get("tbl")) || "";

  const {
    data: tblData,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["get table sidebar", tblId],
    queryFn: () => getTable(tblId),
  });

  const { data: tableOptions } = useQuery({
    queryKey: ["get table options", tblData?.db_id],
    queryFn: () => getTablesByDB(tblData?.db_id),
  });
  // console.log({ tblData, tableOptions });

  // const {
  //   data: prevIndData,
  //   isError: prevError,
  //   isLoading: prevLoading,
  // } = useQuery({
  //   queryKey: ["get PrevIndicator ", tblId],
  //   queryFn: () => getPrevIndicator(tblId),
  // });

  if (isLoading) return <Loader />;
  if (isError) return <p>Алдаа гарлаа </p>;
  if (!tblData) return <p>Мэдээлэл байхгүй байна </p>;

  let initIndicator: IIndicator = {
    id: !!isEdit ? (inData?.id as number) : 0 || 0,
    tbl_id: currentTableId != "" ? currentTableId : inData?.tbl_id || 0,
    code: inData?.code || "",
    name:
      isEdit === undefined
        ? ""
        : isEdit
        ? (inData?.name as string)
        : (("DUPLICATE-NAME " + inData?.name) as string),
    frequency_id: inData?.frequency_id || 0,
    unit_id: inData?.unit_id || 0,
    value_type_id: inData?.value_type_id || 0,
    security_level_id: inData?.security_level_id || 0,
    is_methodology: inData?.is_methodology || false,
    methodology: inData?.methodology || "",
    is_methodology_confirm: inData?.is_methodology_confirm || false,
    methodology_decree_num: inData?.methodology_decree_num || "",
    methodology_date: inData?.methodology_date || "",
    confirmed_organtization: inData?.confirmed_organtization || "",
    generated_date: inData?.generated_date || "",
    is_classification: inData?.is_classification || false,
    classification_count: inData?.classification_count || 0,
    frequency_other: inData?.frequency_other || "",
    is_active: inData?.is_active || false,
    version: inData?.version || "",
    table: tblData || ({} as ITable),
  };

  const { id, name } = tblData;

  const onSubmit = async (values: IIndicator) => {
    try {
      setLoading(true);

      const data: IIndicator = {
        id: values?.id,
        is_active: values?.is_active,
        tbl_id: values?.tbl_id || 0,
        code: values?.code || "",
        name: values?.name || "",
        frequency_id: values?.frequency_id || 0,
        unit_id: values?.unit_id || 0,
        value_type_id: values?.value_type_id || 0,
        security_level_id: values?.security_level_id || 0,
        is_methodology: values?.is_methodology || false,
        methodology: values?.methodology || "",
        is_methodology_confirm: values?.is_methodology_confirm || false,
        methodology_decree_num: values?.methodology_decree_num || "",
        methodology_date: values?.methodology_date || "",
        confirmed_organtization: values?.confirmed_organtization || "",
        generated_date: +values?.generated_date || "",
        is_classification: values?.is_classification || false,
        classification_count: values?.is_classification
          ? values?.classification_count
          : 0,
        frequency_other: values?.frequency_other || "",
        version: values?.version || "",
      };

      const response = await createIndicatorService(data);

      if (response.status == "success") {
        setStatus("success");
        window.location.reload();
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  return (
    <Box sx={{ width: "100%", px: 2, height: 700, overflow: "scroll" }}>
      <div className=" overflow-x-auto">
        {/* <Button className="text-primary-default inline-flex items-center">
          <Timer2LineIcon size={12} />
          Өмнөх хувилбар ашиглах
        </Button> */}
        <Formik
          initialValues={initIndicator}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ handleSubmit, values, setFieldValue, errors }) => {
            return (
              <Form className="w-full" method="POST" onSubmit={handleSubmit}>
                {status == "success" ? (
                  <Alert severity="success">Амжилттай хадгаллаа ... </Alert>
                ) : status == "error" ? (
                  <Alert severity="error">Хадгалахад алдаа гарлаа ...</Alert>
                ) : null}
                <Input type="hidden" value={values?.id} />
                <FormBox>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LabelComponent label="1. Хүснэгтийн нэр" />
                    <TooltipComponent content="Хүснэгтийн нэр" />
                  </Box>
                  <SelectComponent
                    options={tableOptions}
                    defaultValue={values.tbl_id}
                    // desabled={true}
                    label="Хүснэгт"
                    name="tbl_id"
                    onChange={(e: any, value: any) => {
                      setFieldValue("tbl_id", value);
                    }}
                    errors={errors?.tbl_id}
                  />
                </FormBox>

                <FormBox>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LabelComponent label="2. Үзүүлэлтийн нэр" />
                    <TooltipComponent content="Үзүүлэлтийн нэр" />
                  </Box>
                  <TextAreaComponent
                    type="text"
                    name="name"
                    label="Үзүүлэлтийн нэр"
                    value={values?.name}
                    onChange={(e: any) => {
                      setFieldValue("name", e.target.value);
                    }}
                    errors={errors.name}
                  />
                </FormBox>
                <FormBox>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LabelComponent label="3. Үзүүлэлтийн дугаар" />
                    <TooltipComponent content="Үзүүлэлтийн дугаар" />
                  </Box>
                  <InputComponent
                    type="text"
                    name="code"
                    label="Үзүүлэлтийн дугаар"
                    value={values?.code}
                    onChange={(e: any) => {
                      setFieldValue("code", e.target.value);
                    }}
                    errors={errors.code}
                  />
                </FormBox>
                <FormBox>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LabelComponent label="4. Үзүүлэлт (талбар/асуулт)-ийн тооцох давтамж" />
                    <TooltipComponent content="Үзүүлэлт (талбар/асуулт)-ийн тооцох давтамж" />
                  </Box>
                  <SelectComponent
                    options={frequencies}
                    label="Давтамж"
                    name="frequency_id"
                    defaultValue={values.frequency_id}
                    onChange={(e: any, value: any) => {
                      setFieldValue("frequency_id", value);
                    }}
                    errors={errors?.frequency_id}
                  />
                </FormBox>
                {values.frequency_id == 7 && (
                  <FormBox>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <LabelComponent label="4.1. Давтамж бусад" />
                      <TooltipComponent content="Давтамж бусад" />
                    </Box>
                    <TextAreaComponent
                      type="text"
                      name="frequency_other"
                      label="Давтамж бусад"
                      value={values?.frequency_other}
                      onChange={(e: any) => {
                        setFieldValue("frequency_other", e.target.value);
                      }}
                      errors={errors.frequency_other}
                    />
                  </FormBox>
                )}
                <FormBox>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LabelComponent label="5. Хэмжих нэгж" />
                    <TooltipComponent content="Хэмжих нэгж" />
                  </Box>
                  <AutocompleteIntroduction
                    options={units}
                    name="unit_id"
                    values={values.unit_id}
                    onchange={(e: any, value: any) => {
                      if (value == null) {
                        setFieldValue("unit_id", null);
                      } else {
                        setFieldValue("unit_id", value?.id);
                      }
                    }}
                    errors={errors?.unit_id}
                  />
                </FormBox>
                <FormBox>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LabelComponent label="	6. Утгын төрөл" />
                    <TooltipComponent content="Утгын төрөл" />
                  </Box>
                  <SelectComponent
                    options={valueTypes}
                    label="	Утгын төрөл"
                    name="value_type_id"
                    defaultValue={values.value_type_id}
                    onChange={(e: any, value: any) => {
                      setFieldValue("value_type_id", value);
                    }}
                    errors={errors?.value_type_id}
                  />
                </FormBox>
                <FormBox>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LabelComponent label="7. Нууцын зэрэглэл" />
                    <TooltipComponent content="Нууцын зэрэглэл" />
                  </Box>
                  <SelectComponent
                    options={security_levels}
                    label="Нууцын зэрэглэл"
                    name="security_level_id"
                    defaultValue={values.security_level_id}
                    onChange={(e: any, value: any) => {
                      setFieldValue("security_level_id", value);
                    }}
                    errors={errors?.security_level_id}
                  />
                </FormBox>
                <FormBox>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LabelComponent label="8. Аргачлал, арга зүй байгаа эсэх" />
                    <TooltipComponent content="Аргачлал, арга зүй байгаа эсэх" />
                  </Box>
                  <SwitchComponent
                    name="is_methodology"
                    label="Аргачлал, арга зүй байгаа эсэх"
                    defaultChecked={values?.is_methodology}
                    onChange={(e) => {
                      setFieldValue("is_methodology", e.target.checked);
                    }}
                  />
                </FormBox>
                <Box sx={{ ml: "2rem" }}>
                  {values.is_methodology && (
                    <>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="8.1. Аргачлал, арга зүйн нэр" />
                          <TooltipComponent content="Аргачлал, арга зүйн нэр" />
                        </Box>
                        <TextAreaComponent
                          type="text"
                          name="methodology"
                          label="Аргачлал, арга зүйн нэр"
                          value={values?.methodology}
                          onChange={(e: any) => {
                            setFieldValue("methodology", e.target.value);
                          }}
                          errors={errors.methodology}
                        />
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="8.2. Аргачлал, арга зүйг баталсан эсэх" />
                          <TooltipComponent content="Аргачлал, арга зүйг баталсан эсэх" />
                        </Box>
                        <SwitchComponent
                          name="is_methodology_confirm"
                          label="Аргачлал, арга зүйг баталсан эсэх"
                          defaultChecked={values?.is_methodology_confirm}
                          onChange={(e) => {
                            setFieldValue(
                              "is_methodology_confirm",
                              e.target.checked
                            );
                          }}
                        />
                      </FormBox>
                      {values.is_methodology_confirm && (
                        <>
                          <FormBox>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <LabelComponent label="8.3. Аргачлал, арга зүйг баталсан тушаалын дугаар" />
                              <TooltipComponent content="Аргачлал, арга зүйг баталсан тушаалын дугаар" />
                            </Box>
                            <InputComponent
                              type="text"
                              name="methodology_decree_num"
                              label="Аргачлал, арга зүйг баталсан тушаалын дугаар"
                              value={values?.methodology_decree_num}
                              onChange={(e: any) => {
                                setFieldValue(
                                  "methodology_decree_num",
                                  e.target.value
                                );
                              }}
                              errors={errors.methodology_decree_num}
                            />
                          </FormBox>
                          <FormBox>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <LabelComponent label="8.4. Аргачлал, арга зүйг баталсан огноо" />
                              <TooltipComponent content="Аргачлал, арга зүйг баталсан огноо" />
                            </Box>
                            <InputComponent
                              type="date"
                              label="	Аргачлал, арга зүйг баталсан огноо"
                              name="methodology_date"
                              value={values.methodology_date}
                              onChange={(e: any) => {
                                setFieldValue(
                                  "methodology_date",
                                  e.target.value
                                );
                              }}
                              errors={errors?.methodology_date}
                            />
                          </FormBox>
                          <FormBox>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <LabelComponent label="8.5.	Аргачлал, арга зүйг баталсан байгууллага" />
                              <TooltipComponent content="Аргачлал, арга зүйг баталсан байгууллага" />
                            </Box>
                            <InputComponent
                              type="text"
                              name="confirmed_organtization"
                              label="	Аргачлал, арга зүйг баталсан байгууллага"
                              value={values?.confirmed_organtization}
                              onChange={(e: any) => {
                                setFieldValue(
                                  "confirmed_organtization",
                                  e.target.value
                                );
                              }}
                              errors={errors.confirmed_organtization}
                            />
                          </FormBox>
                        </>
                      )}
                    </>
                  )}
                </Box>

                <FormBox>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LabelComponent label="9. Үзүүлэлт (талбар/асуулт)-ийг үүсгэсэн он" />
                    <TooltipComponent content="Үзүүлэлт (талбар/асуулт)-ийг үүсгэсэн он" />
                  </Box>
                  <InputComponent
                    type="text"
                    label="Үзүүлэлт (талбар/асуулт)-ийг үүсгэсэн он"
                    name="generated_date"
                    value={values.generated_date}
                    onChange={(e: any) => {
                      setFieldValue("generated_date", e.target.value);
                    }}
                    errors={errors?.generated_date}
                  />
                </FormBox>
                <FormBox>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LabelComponent label="10. Ангилал, код байгаа эсэх" />
                    <TooltipComponent content="Ангилал, код байгаа эсэх" />
                  </Box>
                  <SwitchComponent
                    name="is_classification"
                    label="Маягттай эсэх"
                    defaultChecked={values?.is_classification}
                    onChange={(e) => {
                      setFieldValue("is_classification", e.target.checked);
                    }}
                  />
                </FormBox>
                <Box sx={{ ml: "2rem" }}>
                  {values.is_classification && (
                    <FormBox>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <LabelComponent label="10.1. Ангиллын тоо" />
                        <TooltipComponent content="Ангиллын тоо" />
                      </Box>
                      <InputComponent
                        type="number"
                        name="classification_count"
                        label="Ангиллын тоо"
                        value={values?.classification_count}
                        onChange={(e: any) => {
                          setFieldValue("classification_count", e.target.value);
                        }}
                        errors={errors?.classification_count}
                      />
                    </FormBox>
                  )}
                </Box>
                <FormBox>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LabelComponent label="11. Идэвхтэй эсэх" />
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
                    <LabelComponent label="12. Хувилбар" />
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
                    errors={errors?.version}
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
              </Form>
            );
          }}
        </Formik>
      </div>
    </Box>
  );
};
export default CreateIndicator;
