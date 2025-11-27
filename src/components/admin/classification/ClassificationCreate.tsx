import { IClassification } from "@/interfaces/IClassification";
import { IIndicator } from "@/interfaces/IIndicators";
import {
  createClassification,
  insertClassificationCode,
} from "@/services/ClassificationService";
import { insertIndicatorClassification } from "@/services/IndicatorClassificationService";
import {
  Box,
  Button,
  Input,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import moment from "moment";
import Link from "next/link";
import React from "react";
import Download2LineIcon from "remixicon-react/Download2LineIcon";
import FileUploadLineIcon from "remixicon-react/FileUploadLineIcon";
import * as XLSX from "xlsx";
import {
  InputComponent,
  SelectComponent,
  SwitchComponent,
  TextAreaComponent,
} from "../formComponents";
import FormBox from "../formComponents/FormBox";
import LabelComponent from "../formComponents/LabelComponent";
import { convertToJson } from "./../convertToJson";
import { ClassificationValidation } from "./ClassificatonValidation";
import FileExcelLineIcon from "remixicon-react/FileExcelLineIcon";
import TooltipComponent from "../formComponents/TooltipComponent";
import ClassificationCode from "@/components/classification/ClassificationCode";
import { Modal, ModalHeader, ModalBody } from "flowbite-react";
import BarcodeBoxLineIcon from "remixicon-react/BarcodeBoxLineIcon";

const ClassificationCreate = ({
  indId,
  indData,
  classData,
  sidebarStatus,
  setSidebarStatus,
  setAlertMsg,
  setOpen,
  userId,
}: {
  indId: number;
  indData?: IIndicator[];
  classData?: IClassification;
  sidebarStatus?: boolean;
  setSidebarStatus?: any;
  setAlertMsg?: any;
  setOpen?: any;
  userId?: number;
}) => {
  const indicatorOptions = indData?.filter((item: IIndicator) => {
    return item?.id == indId;
  });
  const classId: any = classData?.id;
  const [alertType, setAlertType] = React.useState("");
  const [fileLoading, setFileLoading] = React.useState(false);
  const [fileName, setFileName] = React.useState("");
  const [openModal, setOpenModal] = React.useState(false);
  return (
    <Box sx={{ width: "100%", px: 2, height: 700, overflow: "scroll" }}>
      <Link
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "right",
          marginTop: 4,
        }}
        target="_blank"
        href="https://res.cloudinary.com/djv1wgfyh/raw/upload/v1728283814/Guide%20files/wyqb4e5axwvviwjunney.xlsx"
      >
        <Typography
          variant="body2"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            width: "fit-content",
            border: "1px solid green",
            padding: 1,
            borderRadius: 3,
          }}
        >
          <FileExcelLineIcon color="green" />
          Ангилал, код оруулах загвар файл татах
        </Typography>
      </Link>
      <Formik
        initialValues={{
          id: classId || null,
          indicator_id: indId,
          name: classData?.name || "",
          code: classData?.code || "",
          definition: classData?.definition || "",
          is_confirm: classData?.is_confirm || false,
          confirmed_decree_date:
            moment(classData?.confirmed_decree_date).format("YYYY-MM-DD") || "",
          confirmed_decree_name: classData?.confirmed_decree_name || "",
          confirmed_decree_num: classData?.confirmed_decree_num || "",
          confirmed_organization1: classData?.confirmed_organization1 || "",
          confirmed_organization2: classData?.confirmed_organization2 || "",
          confirmed_organization3: classData?.confirmed_organization3 || "",
          implemented_date:
            moment(classData?.implemented_date).format("YYYY-MM-DD") || "",
          last_updated_date:
            moment(classData?.last_updated_date).format("YYYY-MM-DD") || "",
          is_active: classData?.is_active || false,
          version: classData?.version || "",
          classificationCode: classData?.classificationCode || [],
        }}
        validationSchema={ClassificationValidation({ classData })}
        onSubmit={async (values) => {
          const insertData: any = {
            id: values.id,
            name: values.name,
            code: values.code,
            definition: values.definition,
            is_confirm: values.is_confirm,
            confirmed_decree_date: values.confirmed_decree_date,
            confirmed_decree_name: values.confirmed_decree_name,
            confirmed_decree_num: values.confirmed_decree_num,
            confirmed_organization1: values.confirmed_organization1,
            confirmed_organization2: values.confirmed_organization2,
            confirmed_organization3: values.confirmed_organization3,
            implemented_date: values.implemented_date,
            last_updated_date: values.last_updated_date,
            is_active: values.is_active,
            version: values.version,
          };
          const resClass = await createClassification(insertData);
          if (resClass.status == "success") {
            const classificaton_id: number = resClass?.data?.id;
            if (values?.id == null) {
              const indClassData: any = {
                indicator_id: values.indicator_id,
                classification_id: classificaton_id,
                created_user: userId,
              };
              const indClass = await insertIndicatorClassification(
                indClassData
              );
              if (indClass?.status == "success") {
                setAlertMsg("success");
                setAlertType("Үзүүлэлт болон ангилал амжилттай хадгаллаа.");
              } else {
                setAlertMsg("error");
              }
            }
            if (classData === undefined) {
              const classCodeData: any = values.classificationCode?.map(
                (item: any) => {
                  return {
                    classification_id: classificaton_id,
                    code: item.code,
                    definition: item.name,
                  };
                }
              );
              const res = await insertClassificationCode(classCodeData);
              if (res?.status == "success") {
                setAlertMsg("success");
                setAlertType("Ангилал амжилттай хадгаллаа.");
                setOpen(false);
                window.location.reload();
              } else {
                setAlertMsg("error");
                setOpen(false);
              }
            }
            if (
              classData !== undefined &&
              classData?.classificationCode.length === 0
            ) {
              const classCodeData: any = values.classificationCode?.map(
                (item: any) => {
                  return {
                    classification_id: classificaton_id,
                    code: item.code,
                    definition: item.name,
                  };
                }
              );
              const res = await insertClassificationCode(classCodeData);
              if (res?.status == "success") {
                setAlertMsg("success");
                setAlertType("Ангилал амжилттай хадгаллаа.");
                setOpen(false);
                window.location.reload();
              } else {
                setAlertMsg("error");
                setOpen(false);
              }
            }
            setAlertMsg("success");
            setSidebarStatus(false);
            setOpen(false);
            window.location.reload();
          } else {
            setAlertMsg("error");
            setOpen(false);
            setSidebarStatus(false);
          }
        }}
      >
        {({ handleSubmit, values, setFieldValue, errors }) => {
          return (
            <form className="w-full" method="POST" onSubmit={handleSubmit}>
              <Input type="hidden" name="id" value={values.id} />
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="1. Үзүүлэлт" />
                  <TooltipComponent content="Үзүүлэлт" />
                </Box>
                <SelectComponent
                  name="indicator_id"
                  options={indicatorOptions}
                  defaultValue={values.indicator_id}
                  desabled={true}
                  onChange={(e: any, newValue: any) =>
                    setFieldValue("indicator_id", newValue)
                  }
                />
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="2. Ангилалын дугаар" />
                  <TooltipComponent content="Ангилалын дугаар" />
                </Box>
                <InputComponent
                  name="code"
                  type="text"
                  label="Ангилалын дугаар"
                  value={values.code}
                  onChange={(e: any) => setFieldValue("code", e.target.value)}
                  errors={errors.code}
                />
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="3. Ангиллын нэр" />
                  <TooltipComponent content="Ангиллын нэр" />
                </Box>
                <InputComponent
                  name="name"
                  type="text"
                  label="Ангиллын нэр"
                  value={values.name}
                  onChange={(e: any) => setFieldValue("name", e.target.value)}
                  errors={errors.name}
                />
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="4. Ангиллын тодорхойлолт" />
                  <TooltipComponent content="Ангиллын тодорхойлолт" />
                </Box>
                <TextAreaComponent
                  name="definition"
                  type="text"
                  label="Ангиллын тодорхойлолт"
                  value={values.definition}
                  onChange={(e: any) =>
                    setFieldValue("definition", e.target.value)
                  }
                  errors={errors.definition}
                />
              </FormBox>

              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="5. Ангилал, кодыг баталсан эсэх" />
                  <TooltipComponent content="Ангилал, кодыг баталсан эсэх" />
                </Box>
                <SwitchComponent
                  name="is_confirm"
                  label="Ангилал, кодыг баталсан эсэх"
                  defaultChecked={values.is_confirm}
                  onChange={(e: any) => {
                    setFieldValue("is_confirm", e.target.checked);
                  }}
                />
              </FormBox>
              <Box sx={{ ml: "2rem" }}>
                {values.is_confirm && (
                  <>
                    <FormBox>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <LabelComponent label="5.1. Ангилал, кодыг баталсан тушаал шийдвэрийн нэр" />
                        <TooltipComponent content="Ангилал, кодыг баталсан тушаал шийдвэрийн нэр" />
                      </Box>
                      <InputComponent
                        name="confirmed_decree_name"
                        type="text"
                        label="Ангилал, кодыг баталсан тушаал шийдвэрийн нэр"
                        value={values.confirmed_decree_name}
                        onChange={(e: any) =>
                          setFieldValue("confirmed_decree_name", e.target.value)
                        }
                        errors={errors.confirmed_decree_name}
                      />
                    </FormBox>
                    <FormBox>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <LabelComponent label="5.2. Ангилал, кодыг баталсан тушаал шийдвэрийн дугаар" />
                        <TooltipComponent content="Ангилал, кодыг баталсан тушаал шийдвэрийн дугаар" />
                      </Box>
                      <InputComponent
                        name="confirmed_decree_num"
                        type="text"
                        label="Ангилал, кодыг баталсан тушаал шийдвэрийн дугаар"
                        value={values.confirmed_decree_num}
                        onChange={(e: any) =>
                          setFieldValue("confirmed_decree_num", e.target.value)
                        }
                        errors={errors.confirmed_decree_num}
                      />
                    </FormBox>
                    <FormBox>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <LabelComponent label="5.3. Ангилал, кодыг баталсан тушаал огноо	" />
                        <TooltipComponent content="Ангилал, кодыг баталсан тушаал огноо	" />
                      </Box>
                      <InputComponent
                        name="confirmed_decree_date"
                        type="date"
                        label="Ангилал, кодыг баталсан тушаал огноо	"
                        value={values.confirmed_decree_date}
                        onChange={(e: any) =>
                          setFieldValue("confirmed_decree_date", e.target.value)
                        }
                        errors={errors.confirmed_decree_date}
                      />
                    </FormBox>
                    <FormBox>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <LabelComponent label="5.4. Ангилал, кодыг баталсан байгууллага" />
                        <TooltipComponent content="Ангилал, кодыг баталсан байгууллага" />
                      </Box>
                      <InputComponent
                        name="confirmed_organization1"
                        type="text"
                        label="Ангилал, кодыг баталсан байгууллага"
                        value={values.confirmed_organization1}
                        onChange={(e: any) =>
                          setFieldValue(
                            "confirmed_organization1",
                            e.target.value
                          )
                        }
                        errors={errors.confirmed_organization1}
                      />
                    </FormBox>
                    <FormBox>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <LabelComponent label="5.5. Ангилал, кодыг баталсан байгууллага 2" />
                        <TooltipComponent content="Ангилал, кодыг баталсан байгууллага 2" />
                      </Box>
                      <InputComponent
                        name="confirmed_organization2"
                        type="text"
                        label="Ангилал, кодыг баталсан байгууллага 2"
                        value={values.confirmed_organization2}
                        onChange={(e: any) =>
                          setFieldValue(
                            "confirmed_organization2",
                            e.target.value
                          )
                        }
                        errors={errors.confirmed_organization2}
                      />
                    </FormBox>
                    <FormBox>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <LabelComponent label="5.6. Ангилал, кодыг баталсан байгууллага 3" />
                        <TooltipComponent content="Ангилал, кодыг баталсан байгууллага 3" />
                      </Box>
                      <InputComponent
                        name="confirmed_organization3"
                        type="text"
                        label="Ангилал, кодыг баталсан байгууллага 3"
                        value={values.confirmed_organization3}
                        onChange={(e: any) =>
                          setFieldValue(
                            "confirmed_organization3",
                            e.target.value
                          )
                        }
                        errors={errors.confirmed_organization3}
                      />
                    </FormBox>
                  </>
                )}
              </Box>

              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="6. Ангилал, кодыг нэвтрүүлсэн огноо" />
                  <TooltipComponent content="Ангилал, кодыг нэвтрүүлсэн огноо" />
                </Box>
                <InputComponent
                  name="implemented_date"
                  type="date"
                  label="Ангилал, кодыг нэвтрүүлсэн огноо"
                  value={values.implemented_date}
                  onChange={(e: any) =>
                    setFieldValue("implemented_date", e.target.value)
                  }
                  errors={errors.implemented_date}
                />
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="7. Ангиллыг хамгийн сүүлд шинэчилсэн огноо" />
                  <TooltipComponent content="Ангиллыг хамгийн сүүлд шинэчилсэн огноо" />
                </Box>
                <InputComponent
                  name="last_updated_date"
                  type="date"
                  label="Ангиллыг хамгийн сүүлд шинэчилсэн огноо"
                  value={values.last_updated_date}
                  onChange={(e: any) =>
                    setFieldValue("last_updated_date", e.target.value)
                  }
                  errors={errors.last_updated_date}
                />
              </FormBox>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="8. Хувилбар" />
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
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="9. Идэвхтэй эсэх" />
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
              <Box>
                {fileLoading && <p>Файлыг хуулж байна, түр хүлээнэ үү</p>}
              </Box>
              <FormBox>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LabelComponent label="10. Ангилал код" />
                  <TooltipComponent content="Ангилал код" />
                </Box>
                {classData && classData?.classificationCode?.length > 0 ? (
                  <Button
                    variant="text"
                    onClick={() => setOpenModal(true)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      justifyContent: "start",
                    }}
                  >
                    <BarcodeBoxLineIcon />
                    <Typography variant="caption">
                      Ангилал, кодын жагсаалт харах
                    </Typography>
                  </Button>
                ) : (
                  <span>
                    <>
                      <Button
                        className="bg-primary-default p-2 text-text-body-small"
                        variant="contained"
                        component="label"
                        tabIndex={-1}
                        startIcon={<FileUploadLineIcon size={16} />}
                        size="small"
                      >
                        Ангилал кодын жагсаалт оруулах
                        <span className="hidden">
                          <TextField
                            className="hidden"
                            size="small"
                            type="file"
                            name="classificationCode"
                            // defaultValue={values.files}
                            // hidden={true}
                            onChange={(e: any) => {
                              e.preventDefault();
                              setFileLoading(true);
                              setFileName(e.target.files[0].name);
                              try {
                                const reader = new FileReader();
                                reader.onload = (e: any) => {
                                  const bstr = e.target.result;
                                  const wb = XLSX.read(bstr, {
                                    type: "binary",
                                  });
                                  const wsname = wb.SheetNames[0];
                                  const ws = wb.Sheets[wsname];
                                  const fileData = XLSX.utils.sheet_to_json(
                                    ws,
                                    {
                                      header: 1,
                                    }
                                  );
                                  const headers: any = fileData[0];
                                  const newData = convertToJson({
                                    headers: headers,
                                    data: fileData,
                                  });

                                  setFieldValue("classificationCode", newData);
                                  newData.length > 0 && setFileLoading(false);
                                };
                                reader.readAsBinaryString(e.target.files[0]);
                              } catch (e) {
                                console.log({ e });
                              } finally {
                                setFileLoading(false);
                              }
                            }}
                          />
                        </span>
                      </Button>

                      <span className="flex items-center justify-between gap-4 mt-2">
                        {errors.classificationCode ? (
                          <p className="text-red-600 text-text-body-small mt-2 p-1">
                            {errors.classificationCode?.toString()}
                          </p>
                        ) : (
                          <Box>
                            {fileName != "" && (
                              <Typography variant="body2" color="success.dark">
                                {fileName} файл амжилттай хууллаа..
                              </Typography>
                            )}
                          </Box>
                        )}
                      </span>
                    </>
                  </span>
                )}
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
      <Modal
        show={openModal}
        onClose={() => setOpenModal(false)}
        className="overflow-y-auto w-full"
      >
        <ModalHeader className="border-b mt-2"></ModalHeader>
        <ModalBody className="p-4">
          <ClassificationCode
            data={classData?.classificationCode}
            name={classData?.name}
          />
        </ModalBody>
      </Modal>
    </Box>
  );
};
export default ClassificationCreate;
