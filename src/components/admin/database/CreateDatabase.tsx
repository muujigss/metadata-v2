import { createDatabaseAll } from "@/services/DatabaseService";
import {
  useGetDbLocation,
  useGetDbType,
  useGetDbTypeSystem,
  useGetLicence,
  useGetOrgs,
  useGetSectors,
  useGetSpecification,
} from "@/utils/customHooks";
import { Alert, Button, Input, Box, Snackbar, Tabs, Tab, Typography } from "@mui/material";
import { Sidebar } from "flowbite-react";
import { Formik } from "formik";
import { useContext, useEffect, useState } from "react";
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
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import CurrentUserContext, { ICurrentUserContext } from "@/utils/context";
import { createFileService } from "@/services/FileService";
import { StyledInput } from "../theme/InputTheme";

interface Item {
  id: string;
  value: string;
}

const CreateDatabase = ({
  userId,
  orgId,
  setOpen,
  dbData,
  dbActivityData,
  dbTechnologyData,
  setAlert,
  sidebarStatus,
  setSidebarStatus,
}: {
  userId?: number;
  orgId: number;
  setOpen: (open: boolean) => void;
  dbData: IDatabase;
  dbActivityData?: any;
  dbTechnologyData?: any;
  setAlert: (status: string) => {};
  sidebarStatus?: boolean;
  setSidebarStatus?: any;
}) => {
  const { data: dbTypes } = useGetDbType();
  const { data: dbTypeSystems } = useGetDbTypeSystem();
  const { data: specifications } = useGetSpecification();
  const { data: organizations } = useGetOrgs();
  const { data: sector } = useGetSectors();
  const { data: dbLocation } = useGetDbLocation();
  const { data: licenceType } = useGetLicence();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [step, setStep] = useState(0);
  const [warningMessage, setWarningMessage] = useState("");
  const { userInfo } = useContext(CurrentUserContext) as ICurrentUserContext;
  const [selectedTab0_regulation_file_id, setSelectedTab0_regulation_file_id] = useState<File | null>(null);
  const [selectedTab0_copyright_file_id, setSelectedTab0_copyright_file_id] = useState<File | null>(null);
  const [selectedTab1_diagram_file_id, setSelectedTab1_diagram_file_id] = useState<File | null>(null);
  const [serviceItems, setServiceItems] = useState<Item[]>([]);

  const addItem = () => {
    setServiceItems(prev => [
      ...prev,
      { id: `item-${prev.length}-${Date.now()}`, value: "" }
    ]);
  };
  const handleChangeService = (id: string, value: string) => {
    setServiceItems(prev =>
      prev.map(item => (item.id === id ? { ...item, value } : item))
    );
  };
  const handleDeleteService = (id: string) => {
    setServiceItems(prev => prev.filter(item => item.id !== id));
  };

  const orgData = organizations?.map((org: IOrganization) => {
    return { name: org.name, id: org.id };
  });

  const selectedOrg = organizations?.find((org: IOrganization) => org.id = orgId)

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
    tab0_id: dbActivityData?.id || 0,
    tab0_name: dbActivityData?.name || "",
    tab0_short_name: dbActivityData?.short_name || "",
    tab0_domain_name: dbActivityData?.domain_name || "", // 5.11.1.3
    tab0_purpose: dbActivityData?.purpose || "", // 5.11.1.4
    tab0_activity: dbActivityData?.activity || "", // 5.11.1.4
    tab0_scope: dbActivityData?.scope || "", // 5.11.1.4
    tab0_regulation_file_id: dbActivityData?.regulation_file_id || null, // 5.11.1.5
    tab0_status_description: dbActivityData?.status_description || "", // 5.11.1.6
    tab0_change_description: dbActivityData?.change_description || "", //  5.11.1.7
    tab0_service_list: dbActivityData?.service_list || "", //  5.11.1.8
    tab0_other_info_list: dbActivityData?.other_info_list || "", //  5.11.1.9
    tab0_full_org_info: dbActivityData?.full_org_info || "", //  5.11.1.10
    tab0_full_user_info: dbActivityData?.full_user_info || "", //  5.11.1.11
    tab0_copyright_description: dbActivityData?.copyright_description || "", //  5.11.1.12
    tab0_copyright_file_id: dbActivityData?.copyright_file_id || null, //  5.11.1.12
    tab0_is_active: dbActivityData?.is_active || false,
    tab0_createdUser: userId || 0,
  };
  const initDB2 = {
    tab1_id: dbTechnologyData?.id || 0,
    tab1_name: dbTechnologyData?.name || "",
    tab1_short_name: dbTechnologyData?.short_name || "",
    tab1_db_type: dbTechnologyData?.db_type || "", // 5.11.2.2
    tab1_db_manage_system: dbTechnologyData?.db_manage_system || "", // 5.11.2.3
    tab1_db_size: dbTechnologyData?.db_size || 0, // 5.11.2.4
    tab1_db_rows_count: dbTechnologyData?.db_db_rows_countsize || 0, // 5.11.2.5
    tab1_resource_location: dbTechnologyData?.resource_location || "", //  5.11.2.6
    tab1_diagram_file_id: dbTechnologyData?.diagram_file_id || null, //  5.11.2.7
    tab1_access_control_info: dbTechnologyData?.access_control_info || "", //  5.11.2.8
    tab1_file_type_info: dbTechnologyData?.file_type_info || "", //  5.11.2.9
    tab1_info_supply: dbTechnologyData?.info_supply || "", //  5.11.2.10
    tab1_service_name: dbTechnologyData?.service_name || "", //  5.11.2.11
    tab1_content_info_supply: dbTechnologyData?.content_info_supply || "", //  5.11.2.12
    tab1_input_values: dbTechnologyData?.input_values || "", //  5.11.2.13
    tab1_output_values: dbTechnologyData?.output_values || "", //  5.11.2.14
    tab1_is_active: dbTechnologyData?.is_active || false,
    tab1_createdUser: userId || 0,
  };
  const initialValues = {
    ...initDB,
    ...initDB1,
    ...initDB2,
  };

  useEffect(() => {
    if (dbActivityData?.regulation_file) {
      setSelectedTab0_regulation_file_id(dbActivityData?.regulation_file);
    }
  }, [dbActivityData?.regulation_file]);
  useEffect(() => {
    if (dbActivityData?.copyright_file_id) {
      setSelectedTab0_copyright_file_id(dbActivityData?.copyright_file);
    }
  }, [dbActivityData?.copyright_file_id]);
  useEffect(() => {
    if (dbTechnologyData?.diagram_file) {
      setSelectedTab1_diagram_file_id(dbTechnologyData?.diagram_file);
    }
  }, [dbTechnologyData?.diagram_file]);
  useEffect(() => {
    if (dbActivityData?.service_list) {
      const parsed = dbActivityData?.service_list.map((item: string, index: number) => { return { id: `item-${index + 1}-${Date.now()}`, value: item } })
      setServiceItems(parsed)
    }
  }, [dbActivityData?.service_list]);

  const onSubmit = async (values: IDatabase) => {
    setLoading(true);
    try {
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
        version: values?.version,
        createdUser: values?.createdUser,
      };
      const dataTab0 = {
        id: values?.tab0_id,
        org_id: values?.org_id,
        name: values?.tab0_name,
        short_name: values?.tab0_short_name,
        domain_name: values?.tab0_domain_name,
        purpose: values?.tab0_purpose,
        activity: values?.tab0_activity,
        scope: values?.tab0_scope,
        regulation_file_id: null,
        status_description: values?.tab0_status_description,
        change_description: values?.tab0_change_description,
        service_list: values?.tab0_service_list,
        other_info_list: values?.tab0_other_info_list,
        full_org_info: `${selectedOrg?.name}, ${selectedOrg?.address}, ${selectedOrg?.phone}, ${selectedOrg?.email}`,
        full_user_info: `${userInfo?.lastname} ${userInfo?.firstname}, ${userInfo?.phone_number}, ${userInfo?.email}`,
        copyright_description: values?.tab0_copyright_description,
        copyright_file_id: null,
        is_active: true,
        created_user: values?.createdUser,
      };
      const dataTab1 = {
        id: values?.tab1_id,
        org_id: values?.org_id,
        name: values?.tab1_name,
        short_name: values?.tab1_short_name,
        db_type: values?.tab1_db_type.toString(),
        db_manage_system: values?.tab1_db_manage_system,
        db_size: values?.tab1_db_size,
        db_rows_count: values?.tab1_db_rows_count,
        resource_location: values?.tab1_resource_location,
        diagram_file_id: null,
        access_control_info: values?.tab1_access_control_info,
        file_type_info: values?.tab1_file_type_info,
        info_supply: values?.tab1_info_supply,
        service_name: values?.tab1_service_name,
        content_info_supply: values?.tab1_content_info_supply,
        input_values: values?.tab1_input_values,
        output_values: values?.tab1_output_values,
        is_active: true,
        created_user: values?.createdUser,
      };
      
      let regulationFileId = dbActivityData?.regulation_file_id;
      let diagramFileId = dbTechnologyData?.diagram_file_id;
      let copyrightFileId = dbActivityData?.copyright_file_id;
      if (!dbActivityData || !dbTechnologyData) {
        regulationFileId = (await saveFile(selectedTab0_regulation_file_id))?.file?.id;
        diagramFileId = (await saveFile(selectedTab1_diagram_file_id))?.file?.id;
        if (selectedTab0_copyright_file_id) {
          copyrightFileId = (await saveFile(selectedTab0_copyright_file_id))?.file?.id;
        }
      } else {
        regulationFileId = await uploadIfChanged(
          selectedTab0_regulation_file_id,
          dbActivityData.regulation_file_id
        );
  
        diagramFileId = await uploadIfChanged(
          selectedTab1_diagram_file_id,
          dbTechnologyData.diagram_file_id
        );
        if (selectedTab0_copyright_file_id) {
          copyrightFileId = await uploadIfChanged(
            selectedTab0_copyright_file_id,
            dbActivityData.copyright_file_id
          );
        }
      }
      const body = {
        bodyDatabase: data,
        bodyActivity: { ...dataTab0, regulation_file_id: regulationFileId, copyright_file_id: copyrightFileId },
        bodyTechnology: { ...dataTab1, diagram_file_id: diagramFileId }
      };
      await saveData(body)
    } catch (err) {
      console.log('-----err-----', err)
      setStatus('error');
      setAlert('error');
      setWarningMessage(err.toString());
    } finally {
      setLoading(false);
    }
  };
  const saveData = async (body: any) => {
    const response = await createDatabaseAll(body);
    if (response.status == "success") {
      window.location.reload();
      setOpen(false);
      setSidebarStatus(false);
    } else {
      setOpen(false);
      setSidebarStatus(false);
    }
    setLoading(false);
    setOpen(false);
    setSidebarStatus(false);
  }
  const saveFile = async (file: any) => {
    try {
      if (!file) {
        setStatus('error');
        setWarningMessage("Файл заавал хавсаргах шаардлагатай.");
        return;
      }
      const formData = new FormData();
      formData.append("created_user", userInfo?.id?.toString() || "");
      formData.append("file", file);
      const responseFile = (await createFileService(formData)).data;
      return responseFile;
    } catch (error) {
      throw error;
    }
  }
  const uploadIfChanged = async (newFile: any, oldFileId: any) => {
    if (!newFile) return oldFileId; 
    
    const isChanged = newFile?.id !== oldFileId;
    if (!isChanged) return oldFileId;
  
    const uploaded = await saveFile(newFile);
    return uploaded?.file?.id ?? oldFileId;
  };

  const getValidationSchema = () => {
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
            <Alert severity="error">{ warningMessage }</Alert>
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
                  if (newStep > step) {
                    const errors = await validateForm();
                    console.log('-----errors------', errors)
                    if (Object.keys(errors).length !== 0) return; // block
                  }
                  if (step === 0) {
                    if (!selectedTab0_regulation_file_id) {
                      setStatus('error');
                      setWarningMessage("Дотооддоо мөрдөж буй дүрэм, журам, шийдвэр файлыг заавал хавсаргах шаардлагатай.");
                      return;
                    }
                    setFieldValue("tab0_service_list", serviceItems.map(a => a.value))
                    if (!serviceItems.length === 0) {
                      setStatus('error');
                      setWarningMessage("Үзүүлэх үйлчилгээний жагсаалт шаардлагатай.");
                      return;
                    }
                  }
                  if (step === 1) {
                    if (!selectedTab1_diagram_file_id) {
                      setStatus('error');
                      setWarningMessage("Мэдээллийн сангийн диаграм файлыг заавал хавсаргах шаардлагатай.");
                      return;
                    }
                  }
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
                          <LabelComponent label="5.11.1.4. Зорилго" />
                          <TooltipComponent content="Зорилго" />
                        </Box>
                        <TextAreaComponent
                          type="text"
                          name="tab0_purpose"
                          label="Зорилго"
                          value={values?.tab0_purpose}
                          onChange={(e: any) => {
                            setFieldValue("tab0_purpose", e.target.value);
                          }}
                          errors={errors.tab0_purpose}
                        />
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="5.11.1.4. Үйл ажиллагаа" />
                          <TooltipComponent content="Үйл ажиллагаа" />
                        </Box>
                        <TextAreaComponent
                          type="text"
                          name="tab0_activity"
                          label="Үйл ажиллагаа"
                          value={values?.tab0_activity}
                          onChange={(e: any) => {
                            setFieldValue("tab0_activity", e.target.value);
                          }}
                          errors={errors.tab0_activity}
                        />
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="5.11.1.4. Хамрах хүрээ" />
                          <TooltipComponent content="Хамрах хүрээ" />
                        </Box>
                        <TextAreaComponent
                          type="text"
                          name="tab0_scope"
                          label="Хамрах хүрээ"
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
                          accept=".pdf, .doc, .docx, .xls, .xlsx"
                          onChange={(fileData: any) => {
                            setSelectedTab0_regulation_file_id(fileData);
                          }}
                          value={selectedTab0_regulation_file_id}
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
                        <div>
                          <ReactQuill
                            value={values?.tab0_change_description}
                            onChange={(content) => {
                              const textContent = content.replace(/<[^>]*>/g, "");
                              if (textContent) setFieldValue("tab0_change_description", content)
                              else setFieldValue("tab0_change_description", null)
                            }}
                            onBlur={() => setFieldTouched("tab0_change_description", true)}
                          />
                          {errors.tab0_change_description && (
                            <p className="text-red-600 text-text-body-small mt-2 p-1">
                              {errors.tab0_change_description}
                            </p>
                          )}
                        </div>
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="5.11.1.8. Үзүүлэх үйлчилгээний жагсаалт" />
                          <TooltipComponent content="Үзүүлэх үйлчилгээний жагсаалт" />
                        </Box>
                        <div>
                          <Button onClick={addItem} variant="outlined">
                            Үйлчилгээ нэмэх
                          </Button>
                          <div className="mt-3 flex gap-2 flex-col">
                            {serviceItems.map((item, index) => {
                              return (
                                <div className="flex gap-3 items-center" key={index}>
                                  { index + 1 }.
                                  <StyledInput
                                    name={`outlined-service`}
                                    className="input w-full"
                                    id={`outlined-service`}
                                    type="text"
                                    value={item.value}
                                    onChange={(e) => handleChangeService(item.id, e.target.value)}
                                    placeholder={`Үйлчилгээ ${index+1}`}
                                    fullWidth
                                    size="small"
                                  />
                                  <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={(e) => handleDeleteService(item.id)}>
                                    <Typography variant="caption">Устгах</Typography>
                                  </Button>
                                </div>
                              )
                            })}
                          </div>
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
                            onChange={(content) => {
                              const textContent = content.replace(/<[^>]*>/g, "");
                              if (textContent) setFieldValue("tab0_other_info_list", content)
                              else setFieldValue("tab0_other_info_list", null)
                            }}
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
                          {
                            selectedOrg && (
                              `${selectedOrg?.name}, ${selectedOrg?.address}, ${selectedOrg?.phone}, ${selectedOrg?.email}`
                            )
                          }
                        </div>
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="5.11.1.11. Харуцсан ажилтны нэр, хаяг, утасны дугаар, цахим шуудан" />
                          <TooltipComponent content="Харуцсан ажилтны нэр, хаяг, утасны дугаар, цахим шуудан" />
                        </Box>
                        <div>
                          {
                            userInfo && (
                              `${userInfo?.lastname} ${userInfo?.firstname}, ${userInfo?.phone_number}, ${userInfo?.email}`
                            )
                          }
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
                            onChange={(content) => {
                              const textContent = content.replace(/<[^>]*>/g, "");
                              if (textContent) setFieldValue("tab0_copyright_description", content)
                              else setFieldValue("tab0_copyright_description", null)
                            }}
                          />
                          {errors.tab0_copyright_description && (
                            <p className="text-red-600 text-text-body-small mt-2 p-1">
                              {errors.tab0_copyright_description}
                            </p>
                          )}
                        </div>
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="5.11.1.12. Зохиогчийн эрх гэрчилгээ" />
                          <TooltipComponent content="Зохиогчийн эрх гэрчилгээ" />
                        </Box>
                        <FileComponent
                          label="Зохиогчийн эрх гэрчилгээ"
                          name="file"
                          accept=".pdf, .doc, .docx, .xls, .xlsx"
                          onChange={(fileData: any) => {
                            setSelectedTab0_copyright_file_id(fileData);
                          }}
                          value={selectedTab0_copyright_file_id}
                          desabled={false}
                        />
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
                          defaultValue={Number(values?.tab1_db_type)}
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
                        <SelectComponent
                          options={dbTypeSystems}
                          label="Мэдээллийн сангийн төрөл"
                          name="tab1_db_manage_system"
                          defaultValue={Number(values?.tab1_db_manage_system)}
                          onChange={(e: any, value: any) => {
                            setFieldValue("tab1_db_manage_system", value);
                          }}
                          errors={errors?.tab1_db_manage_system}
                        />
                        {/* <InputComponent
                          type="text"
                          name="tab1_db_manage_system"
                          label="Мэдээллийн сан удирдах системийн нэр"
                          value={values?.tab1_db_manage_system}
                          onChange={(e: any) => {
                            setFieldValue("tab1_db_manage_system", e.target.value);
                          }}
                          errors={errors.tab1_db_manage_system}
                        /> */}
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="5.11.2.4. Мэдээллийн сангийн хэмжээ" />
                          <TooltipComponent content="Мэдээллийн сангийн хэмжээ" />
                        </Box>
                        <div className="flex gap-1 items-center">
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
                          /Хэмжээ - Mb/
                        </div>
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="5.11.2.5. Мэдээллийн сан дан Үндсэн бичлэгийн тоо" />
                          <TooltipComponent content="Мэдээллийн сан дан Үндсэн бичлэгийн тоо" />
                        </Box>
                        <InputComponent
                          type="number"
                          name="tab1_db_rows_count"
                          value={values?.tab1_db_rows_count}
                          label="Мэдээллийн сан дан Үндсэн бичлэгийн тоо"
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
                          accept=".pdf, .doc, .docx, .xls, .xlsx"
                          onChange={(fileData: any) => {
                            setSelectedTab1_diagram_file_id(fileData);
                          }}
                          value={selectedTab1_diagram_file_id}
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
                            onChange={(content) => {
                              const textContent = content.replace(/<[^>]*>/g, "");
                              if (textContent) setFieldValue("tab1_access_control_info", content)
                              else setFieldValue("tab1_access_control_info", null)
                            }}
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
                            onChange={(content) => {
                              const textContent = content.replace(/<[^>]*>/g, "");
                              if (textContent) setFieldValue("tab1_file_type_info", content)
                              else setFieldValue("tab1_file_type_info", null)
                            }}
                          />
                          {errors.tab1_file_type_info && (
                            <p className="text-red-600 text-text-body-small mt-2 p-1">
                              {errors.tab1_file_type_info}
                            </p>
                          )}
                        </div>
                      </FormBox>
                      {/* <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="5.11.2.10. Мэдээллийн хариуцагчаас үндсэн системд нийлүүлж буй мэдээлэл" />
                          <TooltipComponent content="Мэдээллийн хариуцагчаас үндсэн системд нийлүүлж буй мэдээлэл" />
                        </Box>
                        <div>
                          <ReactQuill
                            value={values?.tab1_info_supply}
                            onChange={(content) => {
                              const textContent = content.replace(/<[^>]*>/g, "");
                              if (textContent) setFieldValue("tab1_info_supply", content)
                              else setFieldValue("tab1_info_supply", null)
                            }}
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
                            onChange={(content) => {
                              const textContent = content.replace(/<[^>]*>/g, "");
                              if (textContent) setFieldValue("tab1_content_info_supply", content)
                              else setFieldValue("tab1_content_info_supply", null)
                            }}
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
                            onChange={(content) => {
                              const textContent = content.replace(/<[^>]*>/g, "");
                              if (textContent) setFieldValue("tab1_input_values", content)
                              else setFieldValue("tab1_input_values", null)
                            }}
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
                            onChange={(content) => {
                              const textContent = content.replace(/<[^>]*>/g, "");
                              if (textContent) setFieldValue("tab1_output_values", content)
                              else setFieldValue("tab1_output_values", null)
                            }}
                          />
                          {errors.tab1_output_values && (
                            <p className="text-red-600 text-text-body-small mt-2 p-1">
                              {errors.tab1_output_values}
                            </p>
                          )}
                        </div>
                      </FormBox> */}
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
      
                      <div className="flex justify-end p-3">
                        <Button
                          className="text-primary-default bg-primary-medium bg-opacity-50 hover:bg-tertirary-background hover:text-tertirary-default"
                          variant="contained"
                          color="success"
                          type="submit"
                          size="large"
                          disabled={loading}
                          startIcon={<SaveIcon />}
                        >
                          {loading ? "Хадгалж байна..." : "Хадгалах"}
                        </Button>
                      </div>
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
