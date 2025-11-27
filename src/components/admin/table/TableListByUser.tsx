import React, { Suspense, useState } from "react";
import Loader from "../../Loader";
import DataGridComponent from "../DataGridComponent";
import ModalComponent from "../formComponents/ModalComponent";
import SidebarComponents from "../SideBarComponents";
import TableDetailByUser from "./TableDetailByUser";
import { useGetSources } from "@/utils/customHooks";
import { Box, Tooltip } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Link from "next/link";
import PulseLineIcon from "remixicon-react/PulseLineIcon";

interface searchParamsProps {
  org: number;
  db: number;
  setAlert?: any;
  dbData?: any;
  type?: any;
  openModal?: any;
  setOpenModal?: any;
}
const TableListByUser = ({
  org,
  db,
  setAlert,
  dbData,
  type,
  openModal,
  setOpenModal,
}: searchParamsProps) => {
  const [tblId, setTblId] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const columns = [
    { field: "id", headerName: "№", width: 50 },
    { field: "name", headerName: "Хүснэгтийн нэр", width: 200 },
    { field: "is_active", headerName: "Идэвхтэй эсэх", width: 20 },
    {
      field: "action",
      headerName: "Үзүүлэлт харах",
      width: 200,
    },
  ];
  // const { data: libSources } = useGetSources();

  const rowData = dbData?.tables.map((item: any) => {
    return {
      id: item?.id || item?.id,
      name: item?.name || item?.name,
      is_active: item?.is_active || item?.is_active,
      action: (
        <Tooltip title="Үзүүлэлтийн жагсаалт харах">
          <Link
            className="text-blue-500 hover:text-blue-700"
            href={`/admin/indicator-classification?tbl=${item?.id}`}
          >
            <PulseLineIcon />
          </Link>
        </Tooltip>
      ),
    };
  });
  const handleClick = (id: number) => {
    setTblId(id);
    setOpen(true);
  };
  return (
    <Grid container>
      <Grid size={{ xs: 6, md: 5 }}>
        <Box>
          <DataGridComponent
            data={rowData}
            columns={columns}
            handleClick={handleClick}
            listId={tblId}
          />
        </Box>
        <Suspense fallback={<Loader />}>
          <ModalComponent
            id={db}
            open={openModal}
            setOpen={setOpenModal}
            type={type}
            setAlert={setAlert}
            data={dbData}
          />
        </Suspense>
      </Grid>
      <Grid size={{ xs: 6, md: 7 }}>
        <Box
          sx={{
            height: 700,
            width: "100%",
            overflow: "scroll",
          }}
        >
          {open ? (
            <Suspense fallback={<Loader />}>
              <TableDetailByUser
                id={tblId}
                dbId={db}
                setOpen={setOpen}
                setAlert={setAlert}
                setOpenModal={setOpenModal}
              />
            </Suspense>
          ) : (
            <Suspense fallback={<Loader />}>
              <SidebarComponents database={dbData} />
            </Suspense>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};
export default TableListByUser;
