import { getMainIndicatorModel } from "@/services/model/MainIndicatorModel";
import { Box, CardContent, Grid2, Typography } from "@mui/material";
import numeral from "numeral";
import Building4LineIcon from "remixicon-react/Building4LineIcon";
import Database2LineIcon from "remixicon-react/Database2LineIcon";

const TopCards = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: any;
  icon: any;
}) => {
  return (
    <Grid2
      size={{
        xs: 12,
        sm: 6,
        md: 2,
      }}
    >
      <Box
        bgcolor={"#e8f7ff"}
        textAlign={"center"}
        sx={{
          borderRadius: "4px",
          boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
          }}
        >
          <Typography>{icon}</Typography>
          <Typography color={"primary.dark"} variant="h6" fontWeight={600}>
            {numeral(value).format("0,0")}
          </Typography>
          <Typography color={"text.secondary"} variant="body2">
            {label}
          </Typography>
        </CardContent>
      </Box>
    </Grid2>
  );
};

export default TopCards;
