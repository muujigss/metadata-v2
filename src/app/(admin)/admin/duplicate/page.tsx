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
  const [selectedDuplicate, setSelectedDuplicate] = useState<string | null>(
    null
  );
  const [details, setDetails] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchDuplicates();
  }, []);

  const fetchDuplicates = async () => {
    try {
      setLoadingList(true);
      const data = await getDuplicateIndicators();
      setDuplicates(data);
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
          <Typography variant="h6" className="font-bold text-gray-800">
          Жагсаалт
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Нийт давхцсан үгнүүдийн тоо: {duplicates.length}
          </Typography>
        </Box>
        <Divider />
        <div className="flex-1 overflow-y-auto">
          {loadingList ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {duplicates.map((item, index) => (
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
          <Typography variant="h6" className="font-bold text-gray-800">
          Дэлгэрэнгүй
          </Typography>
          {selectedDuplicate && (
            <Typography variant="subtitle1" color="primary">
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
                <Paper key={index} variant="outlined" className="p-4">
                  <div className="flex gap-2 mb-2">
                    <Typography className="font-bold text-gray-500 min-w-[24px]">
                      {index + 1}.
                    </Typography>
                    <Breadcrumbs aria-label="breadcrumb">
                      <Typography
                        color="text.primary"
                        className="font-semibold"
                      >
                        {detail.table?.database?.organization?.name ||
                          "Байгууллага"}
                      </Typography>
                      <Typography color="text.primary">
                        {detail.table?.database?.name || "Өгөгдлийн сан"}
                      </Typography>
                      <Typography color="text.primary">
                        {detail.table?.name || "Хүснэгт"}
                      </Typography>
                      <Typography color="text.primary">{detail.name}</Typography>
                    </Breadcrumbs>
                  </div>
                  <Box mt={2} display="flex" justifyContent="flex-end">
                    <Link
                      href={`/admin/database?org=${detail.table?.database?.organization?.id}&db=${detail.table?.database?.id}`}
                      passHref
                    >
                      <Typography
                        variant="button"
                        className="text-blue-600 hover:underline cursor-pointer"
                      >
                        Өгөгдлийн сан руу очих &rarr;
                      </Typography>
                    </Link>
                  </Box>
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
