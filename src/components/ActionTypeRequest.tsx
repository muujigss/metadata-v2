"use client";
import { useGetActionType } from "@/utils/customHooks";
import { Alert, Box, Button } from "@mui/material";
import { useState } from "react";
import { SelectComponent } from "./admin/form";
import TooltipComponent from "./admin/formComponents/TooltipComponent";
import Loader from "./Loader";
import ModalComponent from "./admin/formComponents/ModalComponent";
import { useQuery } from "@tanstack/react-query";
import { getOneDatabase } from "@/services/DatabaseService";

const ActionTypeRequest = ({
  userId,
  orgId,
  dbId,
}: {
  action_type: number;
  user_level: number;
  userId: number;
  orgId: number;
  dbId: number;
}) => {
  let [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(0);
  const [alertMessage, setAlertMessage] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [showAlert, setShowAlert] = useState("");

  const { data: actionType, isLoading: actionTypeLoading } = useGetActionType();
  const { data: useGetChangeActionType } = useGetActionType();
  const { data: databaseData, isLoading } = useQuery({
    queryKey: ["get db detail on admin", dbId],
    queryFn: () => getOneDatabase(dbId),
  });

  if (loading) return <Loader />;
  if (actionTypeLoading) return <Loader />;

  const onSendActions = async (actionType: number) => {
    try {
      if (!actionType) return setAlertMessage("Төлөв заавал сонгоно уу");
      setLoading(true);
      handleModal()

    } catch (error) {
    } finally {
      console.log("----finally----");
      setLoading(false);
    }
  };

  const handleModal = () => {
    console.log("handleModal called");
    setOpenModal(!openModal);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "left",
        alignItems: "center",
        mt: 1,
        gap: 1,
      }}
    >
      <p className="py-1 text-justify text-wrap">Хүсэлт</p>

      <TooltipComponent
        content="Санд өөрчлөлт оруулах, Санг ашиглалтаас гаргах гэсэн хүсэлт харагдана"
      />
      <SelectComponent
        options={useGetChangeActionType.filter((item: any) => item.id == 5 || item.id ==6)}
        label=""
        name="action_type"
        defaultValue={selectedType}
        onChange={(e: any, value: any) => {
          console.log("handleModal called", value);
          setSelectedType(value);
        }}
      />
      <Button
        variant="outlined"
        color={"info"}
        size="small"
        onClick={() => onSendActions(selectedType)}
      >
        Хүсэлт илгээх
      </Button>

      <ModalComponent
        userId={userId}
        id={Number(selectedType)}
        open={openModal}
        setOpen={setOpenModal}
        type={"DatabaseChangeRequest"}
        setAlert={setShowAlert}
        data={databaseData}
      />

      {alertMessage && <Alert severity="error">{alertMessage}</Alert>}
    </Box>
  );
};

export default ActionTypeRequest;
