import { Box, Button } from "@mui/material";
import { useState } from "react";
import DataGridComponent from "../DataGridComponent";
import SidebarComponents from "../SideBarComponents";
import FormDetailByUser from "./FormDetailByUser";
import ModalComponent from "../formComponents/ModalComponent";
import { useGetSources } from "@/utils/customHooks";
import { ISource } from "@/interfaces/ILib";
import Grid from "@mui/material/Grid2";

const FormListByUser = ({
  org,
  db,
  dbData,
  type,
  setAlert,
  openModal,
  setOpenModal,
}: {
  org: number;
  db: number;
  dbData: any;
  type: string;
  setAlert: any;
  openModal: boolean;
  setOpenModal: any;
}) => {
  const [tabStatus, setTabStatus] = useState("get");
  const [formId, setFormId] = useState<number>(0);
  const [open, setOpen] = useState(false);
  // const [openModal, setOpenModal] = useState(false);
  const { data: libSources } = useGetSources();
  const columns = [
    { field: "id", headerName: "№", width: 70 },
    { field: "form_name", headerName: "Маягтын нэр", width: 200 },
    {
      field: "is_active",
      headerName: "Идэвхтэй эсэх",
      width: 20,
    },
  ];
  const rowData = dbData?.forms?.map((item: any) => {
    return {
      id: item?.id || item?.id,
      name: item?.name || item?.name,
      is_active: item?.is_active || item?.is_active,
    };
  });

  const handleClick = (id: number) => {
    setOpen(true);
    setFormId(id);
  };
  return (
    <Grid container>
      <Grid size={{ xs: 6, md: 5 }}>
        <Box>
          <DataGridComponent
            data={rowData}
            columns={columns}
            handleClick={handleClick}
            listId={formId}
          />
        </Box>
        <ModalComponent
          open={openModal}
          setOpen={setOpenModal}
          data={dbData}
          id={db}
          setAlert={setAlert}
          type={type}
        />
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
            <FormDetailByUser
              id={formId}
              dbId={db}
              open={open}
              setOpen={setOpen}
              setAlert={setAlert}
              setOpenModal={setOpenModal}
              // setTabStatus={setTabStatus}
            />
          ) : (
            <SidebarComponents database={dbData} />
          )}
        </Box>
      </Grid>
    </Grid>
  );
};
export default FormListByUser;
