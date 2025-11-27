"use client";
import { Button } from "@mui/material";
import React from "react";
import AddLineIcon from "remixicon-react/AddLineIcon";
import { Alert, Box } from "@mui/material";
import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import OrgCreate from "./OrgCreate";

const AddOrganization = () => {
  const [openModal, setOpenModal] = React.useState(false);
  const [statusCode, setStatusCode] = React.useState("");
  const [alertMessage, setAlertMessage] = React.useState("");

  return (
    <>
      <Button
        onClick={() => setOpenModal(!openModal)}
        sx={{
          border: "1px solid #518df9",
          color: "#518df9",
          display: "flex",
        }}
      >
        <AddLineIcon size={24} />
        Байгууллага
      </Button>
      {openModal && (
        <Modal show={openModal} onClose={() => setOpenModal(!openModal)}>
          <ModalHeader className="border-b mt-1">Байгууллага нэмэх</ModalHeader>
          <ModalBody className="p-3">
            <Box>
              {statusCode == "error" ? (
                <Alert severity="warning">{alertMessage}</Alert>
              ) : statusCode == "200" ? (
                <Alert severity="success">{alertMessage}</Alert>
              ) : null}
            </Box>
            <OrgCreate />
          </ModalBody>
        </Modal>
      )}
    </>
  );
};

export default AddOrganization;
