"use client";
import React, { useEffect, useState } from "react";
import {
  getDuplicateIndicators,
  getDuplicateIndicatorDetails,
} from "@/services/IndicatorService";
import {
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
  Divider,
  Box,
  CircularProgress,
  Breadcrumbs,
} from "@mui/material";
import Link from "next/link";

const DuplicatePage = () => {
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [filteredDuplicates, setFilteredDuplicates] = useState<any[]>([]);
  const [selectedDuplicate, setSelectedDuplicate] = useState<string | null>(
    null
  );
  const [details, setDetails] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDuplicates();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = duplicates.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDuplicates(filtered);
    } else {
      setFilteredDuplicates(duplicates);
    }
  }, [searchTerm, duplicates]);

  const fetchDuplicates = async () => {
    try {
      setLoadingList(true);
      const data = await getDuplicateIndicators();
      setDuplicates(data);
      setFilteredDuplicates(data);
    } catch (error) {
      console.error("Failed to fetch duplicates", error);
    } finally {
      setLoadingList(false);
    }
  };

  const handleSelectDuplicate = async (name: string) => {
    setSelectedDuplicate(name);
    try {
      setLoadingDetails(true);
      const data = await getDuplicateIndicatorDetails(name);
      setDetails(data);
    } catch (error) {
      console.error("Failed to fetch details", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-full bg-gray-50 p-4 gap-4">
      {/* Left Side - List */}
      <Paper elevation={3} className="w-1/3 flex flex-col overflow-hidden">
        <Box p={2} bgcolor="white">
          <div className="flex justify-between items-center mb-2">
            <Typography variant="h6" className="font-bold text-gray-800">
              Жагсаалт
            </Typography>
            <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              Нийт: {duplicates.length}
            </div>
          </div>
          <input
            type="text"
            placeholder="Хайх..."
            className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
        <Divider />
        <div className="flex-1 overflow-y-auto">
          {loadingList ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {filteredDuplicates.map((item, index) => (
                <ListItemButton
                  key={index}
                  selected={selectedDuplicate === item.name}
                  onClick={() => handleSelectDuplicate(item.name)}
                  divider
                >
                  <ListItemText
                    primary={item.name}
                    secondary={`Тоо: ${item.count}`}
                    primaryTypographyProps={{ className: "font-medium" }}
                  />
                </ListItemButton>
              ))}
            </List>
          )}
        </div>
      </Paper>

      {/* Right Side - Details */}
      <Paper elevation={3} className="w-2/3 flex flex-col overflow-hidden">
        <Box p={2} bgcolor="white">
          <div className="flex justify-between items-center">
            <Typography variant="h6" className="font-bold text-gray-800">
              Дэлгэрэнгүй
            </Typography>
            {selectedDuplicate && (
              <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                Давхцал: {details.length}
              </div>
            )}
          </div>
          {selectedDuplicate && (
            <Typography variant="subtitle1" color="primary" className="mt-1">
              {selectedDuplicate}
            </Typography>
          )}
        </Box>
        <Divider />
        <div className="flex-1 overflow-y-auto p-4">
          {loadingDetails ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : !selectedDuplicate ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
              className="text-gray-400 mt-10"
            >
              Жагсаалтаас сонгоно уу
            </Box>
          ) : (
            <div className="space-y-4">
              {details.map((detail, index) => (
                <Paper key={index} variant="outlined" className="p-4 relative">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2 items-start">
                      <Typography className="font-bold text-gray-500 min-w-[24px] mt-1">
                        {index + 1}.
                      </Typography>
                      <div className="flex flex-col gap-1">
                        <Typography className="text-sm text-gray-600">
                          <span className="font-semibold">Байгууллага:</span>{" "}
                          {detail.table?.database?.organization?.name || "-"}
                        </Typography>
                        <Typography className="text-sm text-gray-600">
                          <span className="font-semibold">Өгөгдлийн сан:</span>{" "}
                          {detail.table?.database?.name || "-"}
                        </Typography>
                        <Typography className="text-sm text-gray-600">
                          <span className="font-semibold">Хүснэгт:</span>{" "}
                          {detail.table?.name || "-"}
                        </Typography>
                        <Typography className="text-sm text-gray-800 font-medium">
                          <span className="font-semibold">Үзүүлэлт:</span>{" "}
                          {detail.name}
                        </Typography>
                      </div>
                    </div>
                    <Link
                      href={`/admin/indicator-classification?tbl=${detail.table?.id}`}
                      passHref
                    >
                      <Typography
                        variant="button"
                        className="text-blue-600 hover:underline cursor-pointer text-xs whitespace-nowrap ml-4"
                      >
                        Үзүүлэлт рүү очих &rarr;
                      </Typography>
                    </Link>
                  </div>
                </Paper>
              ))}
            </div>
          )}
        </div>
      </Paper>
    </div>
  );
};

export default DuplicatePage;
