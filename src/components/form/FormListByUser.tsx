import { Button } from "@mui/material";
import { useState } from "react";
import AddLineIcon from "remixicon-react/AddLineIcon";
import FileListLineIcon from "remixicon-react/FileListLineIcon";
import DataGridComponent from "../admin/DataGridComponent";
import SidebarComponents from "../admin/SideBarComponents";
import FormCreate from "./FormCreate";
import FormDetailByUser from "./FormDetailByUser";

const FormListByUser = ({
  org,
  db,
  dbData,
  type,
  setAlert,
}: {
  org: number;
  db: number;
  dbData: any;
  type: string;
  setAlert: any;
}) => {
  const [tabStatus, setTabStatus] = useState("get");
  const [formId, setFormId] = useState<number>(0);
  const [open, setOpen] = useState(false);

  const columns = [
    { field: "id", headerName: "№", width: 70 },
    { field: "form_name", headerName: "Маягтнийн нэр", width: 200 },
    {
      field: "source",
      headerName: "Анхан шатны мэдээлэгч/ эх үүсвэр",
      width: 200,
    },
  ];

  return (
    <div className="flex flex-row ">
      <div className="w-full h-[calc(100vh-150px)] overflow-y-scroll">
        <div className="flex items-center justify-start gap-4 border rounded-sm shadow-lg p-2">
          {tabStatus == "get" ? (
            <Button
              className="inline-flex gap-1"
              onClick={() => setTabStatus("add")}
            >
              <AddLineIcon size={16} />
              <p className="text-text-body-small text-secondary-default ">
                нэмэх
              </p>
            </Button>
          ) : (
            <Button
              className="inline-flex gap-1"
              onClick={() => setTabStatus("get")}
            >
              <FileListLineIcon size={16} />
              <p className="text-text-body-small text-secondary-default ">
                Жагсаалт харах
              </p>
            </Button>
          )}
        </div>
        {tabStatus == "get" ? (
          <DataGridComponent
            data={dbData?.forms}
            columns={columns}
            setTblId={setFormId}
            setOpen={setOpen}
          />
        ) : (
          <FormCreate
            dbId={db}
            setTabStatus={setTabStatus}
            setAlert={setAlert}
          />
        )}
      </div>
      <div className="w-2/3 h-[calc(100vh-150px)] overflow-y-auto">
        {open ? (
          <FormDetailByUser
            id={formId}
            dbId={db}
            open={open}
            setOpen={setOpen}
            setAlert={setAlert}
            setTabStatus={setTabStatus}
          />
        ) : (
          <SidebarComponents database={dbData} />
        )}
      </div>
    </div>
  );
};
export default FormListByUser;
