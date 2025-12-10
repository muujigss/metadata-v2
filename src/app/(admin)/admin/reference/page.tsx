"use client";
import React, { useEffect, useState } from "react";
import {
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
  Divider,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Snackbar,
  Alert,
  Input,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileEditLineIcon from "remixicon-react/FileEditLineIcon";
import Loader from "@/components/Loader";
import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import AddLineIcon from "remixicon-react/AddLineIcon";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { FormBox, InputComponent, LabelComponent } from "@/components/admin/formComponents";
import TooltipComponent from "@/components/admin/formComponents/TooltipComponent";
import { createDynamicModel, getDynamicService } from "@/services/DynamicService";

const DuplicatePage = () => {
  const [list, setList] = useState<any[]>([
    { id: 1, name: 'Өгөгдлийн сангийн төрөл', tblName: 'actiontype', dynamic: null, allow: false },
    { id: 2, name: 'Зориулалт', tblName: 'specification', dynamic: 'lib_specification', allow: true },
    { id: 3, name: 'Салбар', tblName: 'sector', dynamic: 'lib_sector', allow: false },
    { id: 4, name: 'Өгөгдлийн сангийн байршил', tblName: 'database-location', dynamic: 'lib_db_location', allow: false },
    { id: 5, name: 'Нээлттэй өгөгдлийг ашиглах лицензийн төрөл', tblName: 'license', dynamic: 'lib_license_type', allow: false },
  ]);
  const [tableList, setTableList] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [loadingTable, setLoadingTable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = React.useState(false);
  const [status, setStatus] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const [initData, setInitData] = useState({
    code: '',
    name: '',
  });
  const [modalStatus, setModalStatus] = useState("create");

  const validationSchema = Yup.object({
    code: Yup.string().required("Код оруулна уу."),
    name: Yup.string().required("Нэр оруулна уу."),
  });

  // useEffect(() => {
  //   if (searchTerm) {
  //     const filtered = duplicates.filter((item) =>
  //       item.name.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //     setList(filtered);
  //   } else {
  //     setList(duplicates);
  //   }
  // }, [searchTerm, duplicates]);


  const handleSelectItem = async (item: any) => {
    setSelectedItem(item);
    getList(item.tblName)
  };

  const getList = async (tblName: string) => {
    try {
      setLoadingTable(true);
      const data = await getDynamicService(tblName)
      setTableList(data);
    } catch (error) {
      console.error("Failed to fetch getList", error);
    } finally {
      setLoadingTable(false);
    }
  };

  const handleOpenModal = (data: any) => {
    if (!selectedItem) {
      setStatus('error');
      setWarningMessage("Эхлээд лавлах сангаа сонгоно уу!")
      return;
    }
    if (!selectedItem?.allow) {
      setStatus('error');
      setWarningMessage("Нэмэх зөвшөөрөгдөөгүй лавлах сан байна!")
      return;
    }
    setModalStatus('create')
    setInitData({
      code: '',
      name: '',
    })
    setOpenModal(!openModal);
  };
  const handleView = (data: any) => {
    setModalStatus('view')
    setInitData(data)
    setOpenModal(!openModal);
  };
  const handleEdit = (data: any) => {
    setModalStatus('update')
    setInitData(data)
    setOpenModal(!openModal);
  };

    const onSubmit = async (values: any) => {
      try {
        if (!selectedItem || (!selectedItem?.dynamic)) {
          setStatus('error');
          setWarningMessage("Лавлах сангийн dynamic талбар шалгана уу!")
          return;
        }

        setLoading(true);
  
        const body: any = {
          id: values?.id,
          code: values?.code,
          name: values?.name,
        }
        const response = await createDynamicModel(selectedItem?.dynamic, body)
        if (response) {
          setStatus('success');
          setOpenModal(false);
          getList(selectedItem?.tblName)
        }
      } catch (err: any) {
        setStatus('error');
        // setWarningMessage("Өгөгдлийн сан, Хүснэгт, Үзүүлэлт идэвхитэй эсэхийг шалгана уу!")
        setWarningMessage(err.toString())
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="flex h-[calc(100vh-164px)] w-full bg-gray-50 p-4 gap-4">
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
            <Alert severity="error">{ warningMessage }</Alert>
          ) : null}
        </Box>
      </Snackbar>

      <Paper elevation={3} className="w-1/4 flex flex-col overflow-hidden">
        <Box p={2} bgcolor="white">
          <div className="flex justify-between items-center mb-2">
            <Typography variant="h6" className="font-bold text-gray-800">
              Лавлах сангууд
            </Typography>
          </div>
          {/* <input
            type="text"
            placeholder="Хайх..."
            className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          /> */}
        </Box>
        <Divider />
        <div className="flex-1 overflow-y-auto">
          <List>
            {list.map((item, index) => (
              <ListItemButton
                key={index}
                selected={selectedItem?.name === item.name}
                onClick={() => handleSelectItem(item)}
                divider
              >
                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={{ className: "font-medium" }}
                />
              </ListItemButton>
            ))}
          </List>
        </div>
      </Paper>

      <Paper elevation={3} className="w-3/4 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-2 pl-3 pt-3">
          <Typography variant="h6" className="font-bold text-gray-800">
          { selectedItem?.name ?? '' }
          </Typography>
        </div>
        <div className="flex p-3 gap-3">
          <Button
            sx={{
              border: "1px solid #518df9",
              color: "#518df9",
              display: "flex",
            }}
            onClick={handleOpenModal}
          >
            <AddLineIcon size={24} />
            Нэмэх
          </Button>
          <input
            type="text"
            placeholder="Хайх..."
            className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {
          loadingTable
            ? <Loader />
            : (
                <TableContainer sx={{ maxHeight: 550 }} component={Paper} elevation={0} className="border">
                  <Table>
                    <TableHead className="bg-gray-50">
                      <TableRow>
                        <TableCell>Код</TableCell>
                        <TableCell>Нэр</TableCell>
                        <TableCell>Огноо</TableCell>
                        <TableCell align="center">Үйлдэл</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tableList.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center" className="py-8 text-gray-500">
                            Өгөгдөл байхгүй
                          </TableCell>
                        </TableRow>
                      ) : (
                        tableList
                          // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((item) => (
                          <TableRow key={item.id} hover>
                          <TableCell>
                            <div className="">{item.code}</div>
                          </TableCell>
                            <TableCell>
                              <div className="font-medium">{item.name}</div>
                            </TableCell>
                            <TableCell>
                              {new Date(item.created_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell align="center">
                              <div className="flex justify-center gap-2">
                                <Button
                                  variant="outlined"
                                  color="info"
                                  size="small"
                                  startIcon={<VisibilityIcon />}
                                  onClick={() => handleView(item)}
                                >
                                  Харах
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="success"
                                  size="small"
                                  startIcon={<FileEditLineIcon />}
                                  onClick={() => handleEdit(item)}
                                >
                                  Засварлах
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
            )
        }
      </Paper>

      <Modal
        show={openModal}
        onClose={() => setOpenModal(!openModal)}
        size={"xl"}
        tabIndex={1}
      >
        <ModalHeader className="border-b mt-4">
          <p className=" text-text-title-medium text-secondary-default">
          { selectedItem?.name } нэмэх
          </p>
        </ModalHeader>
        <ModalBody>
          {openModal && (
            <>
              <Formik
                initialValues={initData}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
                enableReinitialize={true}
              >
                {({ handleSubmit, values, setFieldValue, errors }) => {
                  return (
                    <Form method="post" onSubmit={handleSubmit} encType="multipart/form-data">
                      <Input type="hidden" value={values?.user_id} />

                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="Код" />
                          <TooltipComponent content="Код" />
                        </Box>
                        <InputComponent
                          type="text"
                          name="code"
                          value={values?.code}
                          label="Код"
                          onChange={(e: any) => {
                            setFieldValue("code", e.target.value);
                          }}
                          errors={errors?.code}
                        />
                      </FormBox>
                      <FormBox>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LabelComponent label="Нэр" />
                          <TooltipComponent content="Нэр" />
                        </Box>
                        <InputComponent
                          type="text"
                          name="name"
                          value={values?.name}
                          label="Нэр"
                          onChange={(e: any) => {
                            setFieldValue("name", e.target.value);
                          }}
                          errors={errors?.name}
                        />
                      </FormBox>

                      {
                        modalStatus !== 'view' && selectedItem?.allow && (
                          <div className="flex justify-end p-3">
                            <Button
                              type="submit"
                              size="small"
                              className="text-primary-default bg-primary-medium bg-opacity-50 hover:bg-tertirary-background hover:text-tertirary-default"
                              variant="contained"
                              color="success"
                              disabled={loading}
                            >
                              {loading ? "Хадгалж байна..." : (modalStatus === 'create' ? 'Хадгалах' : 'Засварлах')}
                            </Button>
                          </div>
                        )
                      }
                    </Form>
                  );
                }}
              </Formik>
            </>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
};

export default DuplicatePage;
