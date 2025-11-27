"use client";
import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import CreateUserForm from "./CreateUserForm";
import { useQuery } from "@tanstack/react-query";
import { getUserDetailService } from "@/services/UserService";
import Loader from "../Loader";

const User = ({
  userId,
  openModal,
  setOpenModal,
}: {
  userId: number;
  openModal: boolean;
  setOpenModal: any;
}) => {
  const { data: userData, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => userId != 0 && getUserDetailService(userId),
  });
  if (isLoading) return <Loader />;

  return (
    <Modal
      show={openModal}
      onClose={() => setOpenModal(!openModal)}
      size={"5xl"}
      tabIndex={1}
    >
      <ModalHeader className="border-b mt-4">
        <p className=" text-text-title-medium text-secondary-default">
          Хэрэглэгч нэмэх
        </p>
      </ModalHeader>
      <ModalBody>
        {openModal && (
          <CreateUserForm
            openModal={openModal}
            setOpenModal={setOpenModal}
            userData={userData}
          />
        )}
      </ModalBody>
    </Modal>
  );
};

export default User;
