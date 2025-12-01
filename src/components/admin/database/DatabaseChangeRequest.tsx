import {
  useGetUserLevel,
} from "@/utils/customHooks";
import { Alert, Button, Input, Box, Snackbar, Typography, CircularProgress } from "@mui/material";
import { Sidebar } from "flowbite-react";
import { Formik } from "formik";
import { useContext, useState } from "react";
import { validationSchema } from "./DBActionValidationSchema";
import {
  FormBox,
  InputComponent,
  LabelComponent,
  SelectComponent,
  TextAreaComponent,
} from "@/components/admin/formComponents";

import { sidebarTheme } from "@/components/componentTheme/SidebarTheme";
import TooltipComponent from "../formComponents/TooltipComponent";
import CurrentUserContext, { ICurrentUserContext } from "@/utils/context";
import { IAction } from "@/interfaces/IAction";
import FileComponent from "../formComponents/FIle";
import { checkValidationStatus, getActionByIdService, updateActionService } from "@/services/ActionService";
import { IDatabase } from "@/interfaces/IDatabase";
import { createFileService } from "@/services/FileService";
import Loader from "@/components/Loader";
import { useQuery } from "@tanstack/react-query";

const DatabaseChangeRequest = ({
  id,
  actionTypeId,
  userId,
  database,
  modalStatus,
  savedFile,
  setOpen,
  setAlert,
}: {
  id?: number;
  actionTypeId: number;
  userId?: number;
  database?: IDatabase;
  modalStatus?: string;
  savedFile?: any;
  setOpen: (open: boolean) => void;
  setAlert: (status: string) => {};
}) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [warningMessage, setWarningMessage] = useState("");

  const { data: userLevels, isLoading: userLevelLoading } = useGetUserLevel();
  const { userInfo } = useContext(CurrentUserContext) as ICurrentUserContext;
  const userCustomLevels = userLevels;
  
  const { data: selectedAction, isLoading } = useQuery({
    queryKey: ["getActionByIdService on admin", id],
    queryFn: () => getActionByIdService(id),
    enabled: !!id && !!modalStatus, // 👈 RUN ONLY when these are true
  });
  const typeOptions = [
    {  id: 1, groupId: 5, name: "3.1.1.мэдээлэл хариуцагч байгууллага татан буугдсан, өөрчлөн байгуулагдсанаар мэдээллийн санг нэгтгэх, өргөтгөн зохион байгуулах шаардлага үүссэн;", },
    {  id: 2, groupId: 5, name: "3.1.2.хууль, захиргааны хэм хэмжээний актад орсон өөрчлөлтийн дагуу өөрчлөлт оруулах шаардлага үүссэн;", },
    {  id: 3, groupId: 5, name: "3.1.3.мэдээлэл солилцооны систем ашиглан мэдээлэл солилцдог мэдээллийн сангийн бүтцэд өөрчлөлт оруулсан.", },
    {  id: 4, groupId: 6, name: "4.1.1.мэдээлэл хариуцагч байгууллага татан буугдсан, өөрчлөн байгуулагдсанаар мэдээллийн санг бусад мэдээллийн сантай нэгтгэх, өргөтгөх шаардлагагүй болсон;", },
    {  id: 5, groupId: 6, name: "4.1.2.мэдээлэл хариуцагчийн үйл ажиллагаанд ашиглагдахгүй болсон;", },
    {  id: 6, groupId: 6, name: "4.1.3.хууль, захиргааны хэм хэмжээний актад орсон өөрчлөлтийн дагуу мэдээллийн санг ашиглахгүй болсон.", },
  ];
  const selectedTypeOption = selectedAction ? typeOptions.find((option) => option.name === selectedAction?.description) : typeOptions.find((option) => option.groupId === actionTypeId)
  
  const initData = {
    id: 0,
    user_id: userInfo?.id || 0,
    item_id: database?.id,
    file_id: selectedFile || 0,
    description: selectedTypeOption?.name || "",
  };
  const [selectedReason, setSelectedReason] = useState(selectedTypeOption ? selectedTypeOption.id : null);
  
  const onSubmit = async (values: IAction) => {
    try {
      setLoading(true);
      
      await checkValidationStatus(database?.id);
      if (!selectedFile) {
        setStatus('error');
        setWarningMessage("Тушаалын файлыг заавал хавсаргах шаардлагатай.");
        return;
      }

      const formData = new FormData();
      formData.append("created_user", userInfo?.id?.toString() || "");
      if (selectedFile) {
        formData.append("file", selectedFile);
      }
      const responseFile = await saveFile();

      if (responseFile && responseFile.file) {
        const description = typeOptions.filter((option) => option.groupId === actionTypeId).find((option) => option.id === selectedReason)?.name || "";
        const actionBody: IAction = {
          item_id: database?.id,
          user_id: userInfo?.id,
          action_type: actionTypeId,
          file_id: responseFile.file.id,
          description: description,
        }
        await updateActionService(actionBody);
        window.location.reload();
      }
    } catch (err) {
      setStatus('error');
      setAlert('error');
      setWarningMessage(err.toString());
    } finally {
      setLoading(false);
    }
  };
  const saveFile = async () => {
    try {
      if (!selectedFile) return;
      const formData = new FormData();
      formData.append("created_user", userInfo?.id?.toString() || "");
      formData.append("file", selectedFile);
      const responseFile = (await createFileService(formData)).data;
      setLoading(false);
      return responseFile;
    } catch (error) {
      throw error;
    }
  }

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
          initialValues={initData}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ handleSubmit, values, setFieldValue, errors }) => {
            return (
              <form className="w-full" method="POST" onSubmit={handleSubmit}>
                <Input type="hidden" value={values?.id} />
                <FormBox>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LabelComponent label="Үндэслэл" />
                    <TooltipComponent content="Үндэслэл" />
                  </Box>
                  {
                    selectedAction
                      ? (selectedAction?.description)
                      : <SelectComponent
                      options={selectedAction ? typeOptions : typeOptions.filter((option) => option.groupId === actionTypeId)}
                      defaultValue={selectedReason}
                      label="Төрөл"
                      name="type"
                      onChange={(e: any, value: any) => {
                        setSelectedReason(value);
                      }}
                    />
                  }
                </FormBox>
                <FormBox>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LabelComponent label="Хэрэглэгчийн түвшин" />
                    <TooltipComponent content="Хэрэглэгчийн түвшин" />
                  </Box>
                  <SelectComponent
                    options={userCustomLevels}
                    disabled={values?.user_id && userInfo?.user_level === 2 && userInfo?.id === values?.user_id ? true : false}
                    defaultValue={userInfo?.user_level ? parseInt(userInfo?.user_level.toString()) : 0}
                    label="Хэрэглэгчийн түвшин"
                    name="user_level"
                    desabled={true}
                    onChange={(e: any, value: any) => {
                      setFieldValue("user_level", value);
                    }}
                  />
                </FormBox>
                <FormBox>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LabelComponent label="Өгөгдлийн сангийн нэр" />
                    <TooltipComponent content="Өгөгдлийн сангийн нэр" />
                  </Box>
                  <TextAreaComponent
                    type="text"
                    name="name"
                    label="Өгөгдлийн сангийн нэр"
                    value={database?.name}
                    onChange={(e: any) => {}}
                    desabled={true}
                  />
                </FormBox>
                <FormBox>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LabelComponent label="Тушаал" />
                    <TooltipComponent content="Тушаал" />
                  </Box>
                  {
                    modalStatus === "view" ? (
                      !savedFile
                        ? <Typography variant="body2">Тушаал хавсаргаагүй байна.</Typography>
                        : (
                          <Box>
                            <a
                              href={`/api/download/${savedFile?.filename}`}
                            >
                              <Button variant="contained">Файл татах</Button>
                            </a>
                            {/* <a
                              href={`/uploads/requests/${savedFile?.filename}`}
                              download={savedFile?.filename}
                            >
                              <Button variant="contained">
                                Файл татах
                              </Button>
                            </a> */}
                            <Typography variant="body2" className="ml-5">{savedFile?.filename}</Typography>
                          </Box>
                        )
                    ) : <FileComponent
                          label="Тушаал"
                          name="file"
                          onChange={(fileData: any) => {
                            setSelectedFile(fileData);
                          }}
                          value={values?.file_id}
                          desabled={false}
                        />
                  }
                </FormBox>
                <FormBox>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LabelComponent label="Албан хаагчийн нэр" />
                    <TooltipComponent content="Албан хаагчийн нэр" />
                  </Box>
                  <InputComponent
                    type="text"
                    name="lastname"
                    value={userInfo?.lastname && userInfo?.firstname ? (`${userInfo?.lastname} ${userInfo?.firstname}`) : ""}
                    label="Овог"
                    desabled={true}
                    onChange={(e: any) => {}}
                  />
                </FormBox>

                {
                  modalStatus === "view" ? null : 
                    <div className="flex justify-end p-3">
                      <Button
                        className="text-primary-default bg-primary-medium bg-opacity-50 hover:bg-tertirary-background hover:text-tertirary-default"
                        variant="contained"
                        color="success"
                        type="submit"
                        size="small"
                        disabled={loading}
                        startIcon={
                          loading ? <CircularProgress color="inherit" size={16} /> : null
                        }
                      >
                        {loading ? "Илгээх..." : "Илгээх"}
                      </Button>
                    </div>
                }
              </form>
            );
          }}
        </Formik>
      </div>
    </Sidebar>
  );
};
export default DatabaseChangeRequest;
