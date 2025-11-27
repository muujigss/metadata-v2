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
import { IForm } from "@/interfaces/IForm";
import { createForm } from "@/services/FormService";
import {
  fileUpload,
  useGetCollectionMethod,
  useGetDissimenationLevel,
  useGetFrequencies,
  useGetSectors,
  useGetSecurityLevels,
  useGetSources,
} from "@/utils/customHooks";
import { Box, Button, Input, TextField } from "@mui/material";
import { Formik } from "formik";
import moment from "moment";
import Link from "next/link";
import { useState } from "react";
import FileUploadLineIcon from "remixicon-react/FileUploadLineIcon";
import Loader from "../../Loader";
import TooltipComponent from "../formComponents/TooltipComponent";
import { validationSchema } from "./FormValidation";
import AutocompleteIntroduction from "./SearchSelectComponent";

const FormCreate = ({
  dbId,
  setAlert,
  formData,
  sidebarStatus,
  setSidebarStatus,
  form_id,
  setOpen,
  database,
  isEdit,
}: {
  dbId: number;
  setAlert: any;
  formData?: IForm;
  sidebarStatus?: boolean;
  setSidebarStatus?: any;
  form_id?: number;
  setOpen?: any;
  database?: IDatabase;
  isEdit?: boolean;
}) => {
  const { data: sectors, isLoading } = useGetSectors();
  const { data: sources, isLoading: isLoadingSources } = useGetSources();
  const { data: collections, isLoading: isLoadingCollections } =
    useGetCollectionMethod();
  const { data: frenquencies, isLoading: isLoadingFrequencies } =
    useGetFrequencies();
  const { data: dissimenations, isLoading: isLoadingDissimenation } =
    useGetDissimenationLevel();
  const { data: securityLevels, isLoading: isLoadingSecurity } =
    useGetSecurityLevels();
  const [fileLoading, setFileLoading] = useState(false);
  const initialSource = formData?.source_id?.map((item: any) => {
    return +item.id;
  });
  const initialCollection = formData?.collection_method_id?.map((item: any) => {
    return +item.id;
  });
  if (
    isLoading ||
    isLoadingSources ||
    isLoadingCollections ||
    isLoadingFrequencies ||
    isLoadingDissimenation ||
    isLoadingSecurity
  )
    return <Loader />;

  return (
    <div className="bg-white px-4 py-4 w-full overflow-x-auto">
      <Formik
        initialValues={{
          id: isEdit ? formData?.id : 0 || null,
          db_id: dbId,
          name: formData?.name || "",
          code: formData?.code || "",
          description: formData?.description || "",
          decree_num: isEdit ? formData?.decree_num : "",
          confirmed_date:
            moment(formData?.confirmed_date).format("YYYY-MM-DD") || null,
          confirmed_org1: formData?.confirmed_org1 || "",
          confirmed_org2: formData?.confirmed_org2 || "",
          sector_id: formData?.sector_id || null,
          sector_other: formData?.sector_other || "",
          sub_sector: formData?.sub_sector || "",
          coorperate_org: formData?.coorperate_org || "",
          source_id: initialSource || ([] as any),
          source_other: isEdit ? formData?.source_other : "",
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
          owner_email: isEdit ? formData?.owner_email : "",
          owner_phone: isEdit ? formData?.owner_phone : null,
          form_generated_date: formData?.form_generated_date || null,
          form_updated_date: formData?.form_updated_date || "",
          form_table_count: formData?.form_table_count || null,
          estimated_indicators: formData?.estimated_indicators || "",
          keywords: formData?.keywords || "",
          files: isEdit ? formData?.files : "",
          uploadFile: null as any,
          is_active: formData?.is_active || false,
          version: formData?.version || "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          const res = await createForm({
            ...values,
            files: values.uploadFile?.resImageUrl,
          });
          if (res.status == "success") {
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
        }}
      >
        {({ handleSubmit, values, setFieldValue, errors }) => {
          return (
            <form className="w-full" method="POST" onSubmit={handleSubmit}>
              <Input name="id" type="hidden" value={formData?.id} />
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="1. Өгөгдлийн сан:" />
                  <TooltipComponent content="Өгөгдлийн сан" />
                </Box>
                <SelectComponent
                  options={[database || formData?.database]}
                  label="Өгөгдлийн сан"
                  name="db_id"
                  defaultValue={values.db_id}
                  desabled={true}
                  onChange={(e: any, newValue: any) => {
                    setFieldValue("db_id", newValue);
                  }}
                  errors={errors?.db_id}
                />
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="2. Маягтын нэр:" />
                  <TooltipComponent content="Маягтын нэр" />
                </Box>
                <InputComponent
                  type="text"
                  name="name"
                  label="Маягтын нэр"
                  value={values.name}
                  onChange={(e: any) => {
                    setFieldValue("name", e.target.value);
                  }}
                  errors={errors.name}
                />
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="3. Маягтын шифр, дугаар:" />
                  <TooltipComponent content="Маягтын шифр, дугаар" />
                </Box>
                <InputComponent
                  type="text"
                  name="code"
                  label="Маягтын шифр, дугаар"
                  value={values.code}
                  onChange={(e: any) => {
                    setFieldValue("code", e.target.value);
                  }}
                  errors={errors.code}
                />
              </FormBox>

              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="4. Маягтын тайлбар:" />
                  <TooltipComponent content="Маягтын тайлбар" />
                </Box>
                <TextAreaComponent
                  type="text"
                  name="description"
                  label="Маягтын тайлбар"
                  value={values.description}
                  onChange={(e: any) => {
                    setFieldValue("description", e.target.value);
                  }}
                  errors={errors.description}
                />
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="5. Тушаалын дугаар:" />
                  <TooltipComponent content="Тушаалын дугаар" />
                </Box>
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
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="6. Маягт баталсан огноо:" />
                  <TooltipComponent content="Маягт баталсан огноо" />
                </Box>
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
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="7. Баталсан байгууллага №1:" />
                  <TooltipComponent content="Баталсан байгууллага №1" />
                </Box>
                <InputComponent
                  type="text"
                  name="confirmed_org1"
                  label="Баталсан байгууллага №1"
                  value={values.confirmed_org1}
                  onChange={(e: any) => {
                    setFieldValue("confirmed_org1", e.target.value);
                  }}
                  errors={errors.confirmed_org1}
                />
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="8. Баталсан байгууллага №2:" />
                  <TooltipComponent content="Баталсан байгууллага №2" />
                </Box>
                <InputComponent
                  type="text"
                  name="confirmed_org2"
                  label="Баталсан байгууллага №2"
                  value={values.confirmed_org2}
                  onChange={(e: any) => {
                    setFieldValue("confirmed_org2", e.target.value);
                  }}
                  errors={errors.confirmed_org2}
                />
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="9. Салбар" />
                  <TooltipComponent content="Салбар" />
                </Box>
                {/* <SelectComponent
                  options={sectors}
                  label="Салбар"
                  name="sector_id"
                  defaultValue={values.sector_id}
                  onChange={(e: any, newValue: any) => {
                    setFieldValue("sector_id", newValue);
                  }}
                  errors={errors?.sector_id}
                /> */}
                <AutocompleteIntroduction
                  options={sectors}
                  name="sector_id"
                  onchange={(e: any, newValue: any) => {
                    if (newValue == null) {
                      setFieldValue("sector_id", null);
                    } else {
                      setFieldValue("sector_id", newValue.id);
                    }
                  }}
                  values={values.sector_id}
                  errors={errors?.sector_id}
                />
              </FormBox>
              <Box sx={{ ml: "2rem" }}>
                {values.sector_id == 43 && (
                  <FormBox>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <LabelComponent label="9.1. Салбар бичнэ үү:" />
                      <TooltipComponent content="Салбар бичнэ үү." />
                    </Box>
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
                  </FormBox>
                )}
              </Box>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="10. Дэд салбар:" />
                  <TooltipComponent content="Дэд салбар" />
                </Box>
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
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="11. Хамтран гаргадаг байгууллага:" />
                  <TooltipComponent content="Хамтран гаргадаг байгууллага" />
                </Box>
                <InputComponent
                  type="text"
                  name="coorperate_org"
                  label="Хамтран гаргадаг байгууллага:"
                  value={values.coorperate_org}
                  onChange={(e: any) => {
                    setFieldValue("coorperate_org", e.target.value);
                  }}
                  errors={errors.coorperate_org}
                />
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="12. Анхан шатны мэдээлэгч/ эх үүсвэр:" />
                  <TooltipComponent content="Анхан шатны мэдээлэгч/ эх үүсвэр" />
                </Box>
                <MultiSelectComponent
                  options={sources}
                  name="source_id"
                  label="Анхан шатны мэдээлэгч/ эх үүсвэр:"
                  value={values.source_id}
                  onChange={(e: any, newValue: any) => {
                    setFieldValue("source_id", newValue);
                  }}
                  errors={errors.source_id}
                />
              </FormBox>
              <Box sx={{ ml: "2rem" }}>
                {values.source_id.includes(5) && (
                  <FormBox>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <LabelComponent label="12.1. Анхан шатны мэдээлэгч/ эх үүсвэр бусад:" />
                      <TooltipComponent content="Анхан шатны мэдээлэгч/ эх үүсвэр бусад" />
                    </Box>
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
                  </FormBox>
                )}
              </Box>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="13. Мэдээлэл цуглуулах, бүрдүүлэх хэлбэр:" />
                  <TooltipComponent content="Мэдээлэл цуглуулах, бүрдүүлэх хэлбэр" />
                </Box>
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
              </FormBox>
              <Box sx={{ ml: "2rem" }}>
                {values.collection_method_id.includes(7) && (
                  <FormBox>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <LabelComponent label="13.1. Мэдээлэл цуглуулах, бүрдүүлэх хэлбэр бусад:" />
                      <TooltipComponent content="Мэдээлэл цуглуулах, бүрдүүлэх хэлбэр бусад" />
                    </Box>
                    <InputComponent
                      type="text"
                      name="collection_method_other"
                      label="Мэдээлэл цуглуулах, бүрдүүлэх хэлбэр бусад"
                      value={values.collection_method_other}
                      onChange={(e: any) => {
                        setFieldValue(
                          "collection_method_other",
                          e.target.value
                        );
                      }}
                      errors={errors.collection_method_other}
                    />
                  </FormBox>
                )}
              </Box>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="14. Давтамж:" />
                  <TooltipComponent content="Давтамж:" />
                </Box>
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
              </FormBox>
              <Box sx={{ ml: "2rem" }}>
                {values?.frequency_id == 7 && (
                  <FormBox>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <LabelComponent label="14.1. Давтамж бусад:" />
                      <TooltipComponent content="Давтамж бусад" />
                    </Box>
                    <InputComponent
                      type="text"
                      name="frequency_other"
                      label="Давтамж бусад"
                      value={values.frequency_other}
                      onChange={(e: any) => {
                        setFieldValue("frequency_other", e.target.value);
                      }}
                      errors={errors.frequency_other}
                    />
                  </FormBox>
                )}
              </Box>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="15. Бүрдүүлж эхэлсэн он:" />
                  <TooltipComponent content="Бүрдүүлж эхэлсэн он" />
                </Box>
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
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="16. Үр дүнг тархаах түвшин буюу үзүүлэлтийн задаргаа:" />
                  <TooltipComponent content="Үр дүнг тархаах түвшин буюу үзүүлэлтийн задаргаа" />
                </Box>
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
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="17. Маягт нөхөх заавартай эсэх:" />
                  <TooltipComponent content="Маягт нөхөх заавартай эсэх" />
                </Box>
                <SwitchComponent
                  name="is_form_guide"
                  label="Маягт нөхөх заавартай эсэх"
                  defaultChecked={values.is_form_guide}
                  onChange={(e: any) => {
                    setFieldValue("is_form_guide", e.target.checked);
                  }}
                />
              </FormBox>
              {values.is_form_guide && (
                <FormBox>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LabelComponent label="18. Маягт нөхөх зааврын нэр, батлагдсан огноо, тушаалын дугаар:" />
                    <TooltipComponent content="Маягт нөхөх зааврын нэр, батлагдсан огноо, тушаалын дугаар" />
                  </Box>
                  <InputComponent
                    type="text"
                    name="form_guide_decree_num"
                    label="Маягт нөхөх зааврын нэр, батлагдсан огноо, тушаалын дугаар"
                    value={values.form_guide_decree_num}
                    onChange={(e: any) => {
                      setFieldValue("form_guide_decree_num", e.target.value);
                    }}
                    errors={errors.form_guide_decree_num}
                  />
                </FormBox>
              )}
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="19. Мэдээлэл цуглуулах ажилтан:" />
                  <TooltipComponent content="Мэдээлэл цуглуулах ажилтан" />
                </Box>
                <InputComponent
                  type="text"
                  name="collected_officer"
                  label="Мэдээлэл цуглуулах ажилтан:"
                  value={values.collected_officer}
                  onChange={(e: any) => {
                    setFieldValue("collected_officer", e.target.value);
                  }}
                  // errors={errors.form_guide_decree_num}
                />
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="20. Нууцын зэрэглэл:" />
                  <TooltipComponent content="Нууцын зэрэглэл" />
                </Box>
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
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="21. Хариуцдаг газар / хэлтэс/ нэгж:" />
                  <TooltipComponent content="Хариуцдаг газар / хэлтэс/ нэгж" />
                </Box>
                <InputComponent
                  type="text"
                  name="owner_department"
                  label="Хариуцдаг газар / хэлтэс/ нэгж"
                  value={values.owner_department}
                  onChange={(e: any) => {
                    setFieldValue("owner_department", e.target.value);
                  }}
                />
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="22. Хариуцсан нэгжийн холбоо барих албаны цахим шуудангийн хаяг:" />
                  <TooltipComponent content="Хариуцсан нэгжийн холбоо барих албаны цахим шуудангийн хаяг" />
                </Box>
                <InputComponent
                  type="text"
                  name="owner_email"
                  label="Хариуцсан нэгжийн холбоо барих албаны цахим шуудангийн хаяг"
                  value={values.owner_email}
                  onChange={(e: any) => {
                    setFieldValue("owner_email", e.target.value);
                  }}
                />
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="23. Хариуцсан нэгжийн холбоо барих албаны утас:" />
                  <TooltipComponent content="Хариуцсан нэгжийн холбоо барих албаны утас" />
                </Box>
                <InputComponent
                  type="number"
                  name="owner_phone"
                  label="Хариуцсан нэгжийн холбоо барих албаны утас"
                  value={values.owner_phone}
                  onChange={(e: any) => {
                    setFieldValue("owner_phone", e.target.value);
                  }}
                />
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="24. Маягт нэвтрүүлсэн огноо:" />
                  <TooltipComponent content="Маягт нэвтрүүлсэн огноо" />
                </Box>
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
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="25. Маягт шинэчилсэн огноо:" />
                  <TooltipComponent content="Маягт шинэчилсэн огноо" />
                </Box>
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
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="26. Маягтын хүснэгтийн тоо:" />
                  <TooltipComponent content="Маягтын хүснэгтийн тоо" />
                </Box>
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
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="27. Тооцож гаргадаг үзүүлэлтүүд:" />
                  <TooltipComponent content="Тооцож гаргадаг үзүүлэлтүүд" />
                </Box>
                <TextAreaComponent
                  type="text"
                  name="estimated_indicators"
                  label="Тооцож гаргадаг үзүүлэлтүүд"
                  value={values.estimated_indicators}
                  onChange={(e: any) => {
                    setFieldValue("estimated_indicators", e.target.value);
                  }}
                />
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="28. Түлхүүр үг:" />
                  <TooltipComponent content="Түлхүүр үг" />
                </Box>
                <TextAreaComponent
                  type="text"
                  name="keywords"
                  label="Түлхүүр үг"
                  value={values.keywords}
                  onChange={(e: any) => {
                    setFieldValue("keywords", e.target.value);
                  }}
                />
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label={"29. Файл"} />
                  <TooltipComponent content={"Файл"} />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {formData?.files && (
                    <Link
                      className=" text-primary-high"
                      target="_blank"
                      href={formData?.files || ""}
                    >
                      Маягт татах
                    </Link>
                  )}
                  <Box display={"flex"} alignItems={"center"}>
                    <Button
                      className="bg-primary-default p-2 text-text-body-small"
                      variant="contained"
                      component="label"
                      tabIndex={-1}
                      startIcon={<FileUploadLineIcon size={16} />}
                      size="small"
                    >
                      Маягт {formData?.files ? " өөрчлөх" : " оруулах"}
                      <span className="hidden">
                        <TextField
                          inputProps={{ accept: "application/pdf" }}
                          className="hidden"
                          size="small"
                          type="file"
                          name="uploadFile"
                          defaultValue={values.uploadFile}
                          onChange={async (e: any) => {
                            try {
                              setFileLoading(true);
                              const resImageUrl = await fileUpload(
                                e.target.files[0]
                              );
                              setFieldValue("uploadFile", {
                                name: e.target.files[0].name,
                                resImageUrl,
                                type: e.target.files[0].type,
                              });
                            } catch (err) {
                              console.log(err);
                            } finally {
                              setFileLoading(false);
                            }
                          }}
                        />
                      </span>
                    </Button>
                    {fileLoading && (
                      <span className="text-orange-300 text-text-body-small px-1">
                        Файл хуулж байна... Түр хүлээнэ үү
                      </span>
                    )}
                    {values?.uploadFile && (
                      <p className="text-text-body-small px-2 text-tertirary-default text-wrap">
                        {values.uploadFile.name}
                      </p>
                    )}
                  </Box>
                  <span className="flex items-center justify-between gap-4 mt-2">
                    {errors.uploadFile && (
                      <p className="text-red-600 text-text-body-small mt-2 p-1">
                        {errors.uploadFile?.toString()}
                      </p>
                    )}
                  </span>
                </Box>
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="30. Маягт идэвхтэй эсэх:" />
                  <TooltipComponent content="Маягт идэвхтэй эсэх" />
                </Box>
                <SwitchComponent
                  name="is_active"
                  label="Маягт идэвхтэй эсэх"
                  defaultChecked={values.is_active}
                  onChange={(e: any) => {
                    setFieldValue("is_active", e.target.checked);
                  }}
                />
              </FormBox>
              <FormBox>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <LabelComponent label="31. Хувилбар" />
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
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default FormCreate;
