"use client";
import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { useState } from "react";

import EditLineIcon from "remixicon-react/EditLineIcon";
import CreateUserForm from "./CreateUserForm";
import User from "./User";

const UserEditBar = ({ userId, type }: { userId: number; type: string }) => {
  const [open, setOpen] = useState(false);
  const handleModal = () => {
    setOpen(false);
  };
  return (
    <>
      <Tooltip title={"Засах"}>
        <IconButton
          onClick={() => {
            setOpen(true);
          }}
        >
          <EditLineIcon size="18" />
        </IconButton>
      </Tooltip>
      <>
        {open && (
          <User openModal={open} setOpenModal={setOpen} userId={userId} />
        )}
      </>
    </>
  );
};

export default UserEditBar;
