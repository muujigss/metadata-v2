import FormCreate from "@/components/admin/form/FormCreate";
import TableCreate from "@/components/admin/table/TableCreate";
import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import ClassificationCreate from "../classification/ClassificationCreate";
import CreateDatabase from "../database/CreateDatabase";
import CreateIndicator from "../indicator/CreateIndicator";

const ModalComponent = ({
  userId,
  id,
  data,
  open,
  setOpen,
  type,
  setAlert,
}: {
  userId?: number;
  id: number;
  open: boolean;
  setOpen: any;
  type: string;
  setAlert?: any;
  data?: any;
}) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal show={open} onClose={handleClose} size={"5xl"} tabIndex={1}>
      <ModalHeader className="border-b mt-4">
        <p className=" text-text-title-medium text-secondary-default">
          {type == "table"
            ? "Хүснэгт нэмэх"
            : type == "form"
            ? "Маягт нэмэх"
            : type == "classification"
            ? "Ангилал, код нэмэх"
            : type == "database"
            ? "Өгөгдлийн сан нэмэх"
            : type == "indicator"
            ? "Үзүүлэлт нэмэх"
            : "Код нэмэх"}
        </p>
      </ModalHeader>
      <ModalBody>
        {type === "table" ? (
          <TableCreate
            dbId={id}
            setAlert={setAlert}
            setOpen={setOpen}
            database={data}
          />
        ) : type === "form" ? (
          <FormCreate
            dbId={id}
            setAlert={setAlert}
            setOpen={setOpen}
            database={data}
          />
        ) : type === "database" ? (
          <CreateDatabase
            userId={userId}
            orgId={id}
            setAlert={setAlert}
            setOpen={setOpen}
            dbData={data}
          />
        ) : type === "indicator" ? (
          <CreateIndicator
            tblId={id}
            indId={id}
            inData={data}
            setAlert={setAlert}
            setOpen={setOpen}
          />
        ) : type === "classification" ? (
          <ClassificationCreate
            indId={id}
            indData={data}
            setAlertMsg={setAlert}
            setOpen={setOpen}
            userId={userId}
          />
        ) : (
          <p>Код нэмэх</p>
        )}
      </ModalBody>
    </Modal>
  );
};

export default ModalComponent;
