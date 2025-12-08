import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const FileComponent = ({
  onChange,
  label,
  name,
  value,
  errors,
  desabled,
  accept,
}: {
  onChange: any;
  label: string;
  name: string;
  value?: any;
  errors?: any;
  desabled?: any;
  accept?: string;
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  
  useEffect(() => {
    if (value) {
      setSelectedFile(value);
    }
  }, [value]);

  const onSubmit = async (e: any) => {
    setSelectedFile(e.target.files?.[0] ?? null)
    onChange(e.target.files?.[0]);
  };

  return (
    <Box
      sx={{
        display: "flex-col",
        alignItems: "center",
        justifyContent: "space-between",
        columnSpan: 2,
        "& > :not(style)": {
          width: "100%",
        },
      }}
    >
      <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}>
        Файл сонгох
        <input
          type="file"
          accept={accept}
          hidden
          onChange={(e) => onSubmit(e) }
        />
      </Button>
      <Box sx={{ display: "flex", alignItems: "center" }}>
      </Box>
      {/* {selectedFile && <Typography variant="body2" className="ml-5">{selectedFile.name}</Typography>} */}
      {value && <Typography variant="body2" className="ml-5">{value.filename ? value.filename : value.name}</Typography>}
      {errors && (
        <p className="text-red-600 text-text-body-small mt-2 p-1">{errors}</p>
      )}
    </Box>
  );
};

export default FileComponent;
