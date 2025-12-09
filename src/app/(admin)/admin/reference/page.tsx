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
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import getLibraryService from "@/services/LibLibraryService";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileEditLineIcon from "remixicon-react/FileEditLineIcon";
import Loader from "@/components/Loader";

const DuplicatePage = () => {
  const [list, setList] = useState<any[]>([
    { id: 1, name: 'Өгөгдлийн сангийн төрөл', tblName: 'actiontype' },
    { id: 2, name: 'Зориулалт', tblName: 'specification' },
    { id: 3, name: 'Салбар', tblName: 'sector' },
    { id: 4, name: 'Өгөгдлийн сангийн байршил', tblName: 'database-location' },
    { id: 5, name: 'Нээлттэй өгөгдлийг ашиглах лицензийн төрөл', tblName: 'license' },
  ]);
  const [tableList, setTableList] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(
    null
  );
  const [loadingTable, setLoadingTable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  console.log('------list-----', list)

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
    try {
      setLoadingTable(true);
      const data = await getLibraryService(item.tblName)
      console.log('------handleSelectItem---data--', data)
      setTableList(data);
    } catch (error) {
      console.error("Failed to fetch details", error);
    } finally {
      setLoadingTable(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-164px)] w-full bg-gray-50 p-4 gap-4">
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
                selected={selectedItem === item.name}
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
        <div className="p-3">
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
                                  // onClick={() => handleViewDetail(item)}
                                >
                                  Харах
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="success"
                                  size="small"
                                  startIcon={<FileEditLineIcon />}
                                  // onClick={() => handleViewDetail(item)}
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
    </div>
  );
};

export default DuplicatePage;
