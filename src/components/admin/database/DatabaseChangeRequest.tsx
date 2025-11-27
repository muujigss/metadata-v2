import { getOneDatabase } from "@/services/DatabaseService";
import {
  useGetUserLevel,
} from "@/utils/customHooks";
import { Alert, Button, Input, Box, Snackbar } from "@mui/material";
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
import { useQuery } from "@tanstack/react-query";
import FileComponent from "../formComponents/FIle";
import { updateActionService } from "@/services/ActionService";
import { IDatabase } from "@/interfaces/IDatabase";
import Loader from "@/components/Loader";

const DatabaseChangeRequest = ({
  actionTypeId,
  userId,
  database,
  setOpen,
  setAlert,
}: {
  actionTypeId: number;
  userId?: number;
  database?: IDatabase;
  setOpen: (open: boolean) => void;
  setAlert: (status: string) => {};
}) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: userLevels, isLoading: userLevelLoading } = useGetUserLevel();
  const { userInfo } = useContext(CurrentUserContext) as ICurrentUserContext;
  const userCustomLevels = userLevels;

  const initData = {
    id: 0,
    user_id: userInfo?.id || 0,
    item_id: database?.id,
    file_id: selectedFile || 0,
  };

  const onSubmit = async (values: IAction) => {
    try {
      setLoading(true);
      const actionBody: IAction = {
        item_id: database?.id,
        user_id: userInfo?.id,
        action_type: actionTypeId
      }
      await updateActionService(actionBody);
      window.location.reload();
    } catch (err) {
      setStatus("error");
      setAlert("error");
      setLoading(false);
      setOpen(false);
    }
  };

  if (loading) return <Loader />;
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
                  <FileComponent
                    label="Тушаал"
                    name="file"
                    onChange={(fileData: any) => {
                      console.log('----fileData-----', fileData)
                      setSelectedFile(fileData.file);
                    }}
                    value={values?.file_id}
                    desabled={false}
                  />
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
                    onChange={(e: any) => {}}
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
                    Илгээх
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
export default DatabaseChangeRequest;
