"use client";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Loader from "@/components/Loader";
import { Chip } from "@mui/material";

const OrgRequestListPage = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/org-request");
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = (request: any, type: "approve" | "reject") => {
    setSelectedRequest(request);
    setActionType(type);
    setOpenDialog(true);
  };

  const handleViewDetail = (request: any) => {
    setSelectedRequest(request);
    setDetailOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedRequest || !actionType) return;

    try {
      const res = await fetch("/api/admin/org-request", {
        method: actionType === "approve" ? "PUT" : "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          org_id: selectedRequest.id,
          user_id: selectedRequest.users[0]?.id,
        }),
      });

      if (res.ok) {
        fetchRequests();
        setOpenDialog(false);
        setDetailOpen(false);
      } else {
        alert("Алдаа гарлаа");
      }
    } catch (error) {
      console.error("Error performing action", error);
      alert("Алдаа гарлаа");
    }
  };

  const getDeadlineStatus = (createdDate: string) => {
    const created = new Date(createdDate);
    const deadline = new Date(created.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const diffHours = Math.floor(diff / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diff < 0) {
      return { label: "Хугацаа хэтэрсэн", color: "error" as const, expired: true };
    } else if (diffHours < 24) {
      return { label: `${diffHours} цаг үлдсэн`, color: "warning" as const, expired: false };
    } else {
      return { label: `${diffDays} өдөр үлдсэн`, color: "success" as const, expired: false };
    }
  };

  if (loading) return <Loader />;

  return (
    <Box className="p-4">
      <Typography variant="h5" className="mb-4 text-primary-main font-semibold">
        Байгууллагын хүсэлтүүд
      </Typography>
      
      <TableContainer component={Paper} elevation={0} className="border">
        <Table>
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableCell>Лого</TableCell>
              <TableCell>Байгууллага</TableCell>
              <TableCell>И-мэйл</TableCell>
              <TableCell>Утас</TableCell>
              <TableCell>Админ хэрэглэгч</TableCell>
              <TableCell>Албан бичиг</TableCell>
              <TableCell>Огноо</TableCell>
              <TableCell>Хугацаа</TableCell>
              <TableCell align="center">Үйлдэл</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" className="py-8 text-gray-500">
                  Хүсэлт байхгүй байна
                </TableCell>
              </TableRow>
            ) : (
              requests.map((req) => (
                <TableRow key={req.id} hover>
                  <TableCell>
                    {req.img_url ? (
                      <img 
                        src={req.img_url} 
                        alt="Logo" 
                        className="w-12 h-12 object-contain rounded border"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                        No logo
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{req.name}</div>
                    <div className="text-xs text-gray-500">{req.org_short_name}</div>
                  </TableCell>
                  <TableCell>{req.email}</TableCell>
                  <TableCell>{req.phone}</TableCell>
                  <TableCell>
                    {req.users[0] ? (
                      <div>
                        <div>{req.users[0].lastname.substring(0, 1)}. {req.users[0].firstname}</div>
                        <div className="text-xs text-gray-500">{req.users[0].email}</div>
                      </div>
                    ) : (
                      <span className="text-red-500">Хэрэглэгчгүй</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {/* Empty as requested */}
                    <span className="text-gray-400">-</span>
                  </TableCell>
                  <TableCell>
                    {new Date(req.created_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const status = getDeadlineStatus(req.created_date);
                      return (
                        <Chip 
                          label={status.label} 
                          color={status.color} 
                          size="small" 
                          variant={status.expired ? "filled" : "outlined"}
                        />
                      );
                    })()}
                  </TableCell>
                  <TableCell align="center">
                    <div className="flex justify-center gap-2">
                       <Button
                        variant="outlined"
                        color="info"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewDetail(req)}
                      >
                        Харах
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleAction(req, "approve")}
                      >
                        Зөвшөөрөх
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<CancelIcon />}
                        onClick={() => handleAction(req, "reject")}
                      >
                        Татгалзах
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {actionType === "approve" ? "Хүсэлт зөвшөөрөх" : "Хүсэлт татгалзах"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Та <b>{selectedRequest?.name}</b> байгууллагын хүсэлтийг{" "}
            {actionType === "approve" ? "зөвшөөрөх" : "татгалзах"}дээ итгэлтэй байна уу?
            {actionType === "reject" && (
              <div className="mt-2 text-red-600 text-sm">
                Татгалзсан тохиолдолд хүсэлт устах болно.
              </div>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Болих</Button>
          <Button
            onClick={confirmAction}
            color={actionType === "approve" ? "success" : "error"}
            variant="contained"
            autoFocus
          >
            {actionType === "approve" ? "Зөвшөөрөх" : "Татгалзах"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog 
        open={detailOpen} 
        onClose={() => setDetailOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Хүсэлтийн дэлгэрэнгүй</h2>
            <Button onClick={() => setDetailOpen(false)} color="inherit">
              <CancelIcon />
            </Button>
          </div>

          {selectedRequest && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-primary-main mb-4 border-b pb-2">
                  Байгууллагын мэдээлэл
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-center mb-4">
                    {selectedRequest.img_url ? (
                      <img 
                        src={selectedRequest.img_url} 
                        alt="Logo" 
                        className="h-32 object-contain rounded border p-2"
                      />
                    ) : (
                      <div className="h-32 w-32 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                        No Logo
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-gray-500 font-medium">Нэр:</span>
                    <span className="col-span-2">{selectedRequest.name}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-gray-500 font-medium">Товч нэр:</span>
                    <span className="col-span-2">{selectedRequest.org_short_name || "-"}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-gray-500 font-medium">И-мэйл:</span>
                    <span className="col-span-2">{selectedRequest.email}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-gray-500 font-medium">Утас:</span>
                    <span className="col-span-2">{selectedRequest.phone}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-gray-500 font-medium">Хаяг:</span>
                    <span className="col-span-2">{selectedRequest.address || "-"}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-gray-500 font-medium">Вэб сайт:</span>
                    <span className="col-span-2">
                      {selectedRequest.website ? (
                        <a href={selectedRequest.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                          {selectedRequest.website}
                        </a>
                      ) : "-"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-primary-main mb-4 border-b pb-2">
                  Админ хэрэглэгчийн мэдээлэл
                </h3>
                {selectedRequest.users[0] ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500 font-medium">Овог:</span>
                      <span className="col-span-2">{selectedRequest.users[0].lastname}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500 font-medium">Нэр:</span>
                      <span className="col-span-2">{selectedRequest.users[0].firstname}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500 font-medium">И-мэйл:</span>
                      <span className="col-span-2">{selectedRequest.users[0].email}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500 font-medium">Утас:</span>
                      <span className="col-span-2">{selectedRequest.users[0].phone_number || "-"}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500 font-medium">Хэлтэс:</span>
                      <span className="col-span-2">{selectedRequest.users[0].department || "-"}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-500 font-medium">Албан тушаал:</span>
                      <span className="col-span-2">{selectedRequest.users[0].position || "-"}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-red-500">Хэрэглэгчийн мэдээлэл байхгүй</div>
                )}

                <div className="mt-8 flex justify-end gap-3">
                  <Button 
                    variant="contained" 
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => {
                        setActionType("approve");
                        setOpenDialog(true);
                        // setDetailOpen(false); // Optional: close detail or keep it open? Let's keep detail open until confirmed? No, confirm dialog is separate.
                        // Better UX: Close detail, open confirm.
                        // setDetailOpen(false); 
                        // Actually, let's just use the confirmAction directly if we want, but reusing the dialog is safer.
                    }}
                    disabled={loading || !selectedRequest.users[0]}
                  >
                    Зөвшөөрөх
                  </Button>
                  <Button 
                    variant="contained" 
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() => {
                        setActionType("reject");
                        setOpenDialog(true);
                        // setDetailOpen(false);
                    }}
                    disabled={loading}
                  >
                    Татгалзах
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Dialog>
    </Box>
  );
};

export default OrgRequestListPage;
