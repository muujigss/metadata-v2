import { Button } from "@mui/material";
import { useState } from "react";
import AddLineIcon from "remixicon-react/AddLineIcon";
import FileListLineIcon from "remixicon-react/FileListLineIcon";
import DataGridComponent from "../admin/DataGridComponent";
import SidebarComponents from "../admin/SideBarComponents";
import TableCreate from "./TableCreate";
import TableDetailByUser from "./TableDetailByUser";

interface searchParamsProps {
  org: number;
  db: number;
  setAlert?: any;
  dbData?: any;
  type?: any;
}
const TableListByUser = ({
  org,
  db,
  setAlert,
  dbData,
  type,
}: searchParamsProps) => {
  const [tabStatus, setTabStatus] = useState("get");

  const [tblId, setTblId] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const columns = [
    { field: "id", headerName: "№", width: 50 },
    { field: "name", headerName: "Хүснэгтийн нэр", width: 200 },
    { field: "source", headerName: "Анхдагч эх үүсвэр", width: 200 },
  ];

  return (
    <div className="flex ">
      <div className="w-full">
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
            data={dbData?.tables}
            columns={columns}
            setTblId={setTblId}
            setOpen={setOpen}
          />
        ) : (
          <TableCreate dbId={db} setTabStatus={setTabStatus} />
        )}
      </div>
      <div className="w-2/3 shadow border-l">
        {open ? (
          <TableDetailByUser
            id={tblId}
            dbId={db}
            open={open}
            setOpen={setOpen}
            setAlert={setAlert}
          />
        ) : (
          <SidebarComponents database={dbData} />
        )}
      </div>
    </div>
  );
};
export default TableListByUser;
