"use client";
import Link from "next/link";
import Database2FillIcon from "remixicon-react/Database2FillIcon";
import Building4LineIcon from "remixicon-react/Building4LineIcon";
import EditBoxFillIcon from "remixicon-react/EditBoxFillIcon";
import GridLineIcon from "remixicon-react/GridLineIcon";
import PulseLineIcon from "remixicon-react/PulseLineIcon";
import BarcodeBoxLineIcon from "remixicon-react/BarcodeBoxLineIcon";
import { Box, Grid2, Typography } from "@mui/material";
import TopCards from "./TopCard";
import BarChart from "./BarChart";

const StatListComponent = ({ mainIndicator }: { mainIndicator: any }) => {
  return (
    <Box
      sx={{
        container: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
        mx: "auto",
        p: 2,
      }}
    >
      <Grid2 container spacing={3} mt={1}>
        {/* <TopCards
          label="Байгууллага"
          value={mainIndicator.organizations}
          icon={<Building4LineIcon size={24} />}
        /> */}
        <TopCards
          label="Өгөгдлийн сан"
          value={mainIndicator?.databases}
          icon={<Database2FillIcon size={24} />}
        />
        <TopCards
          label="Хүснэгт"
          value={mainIndicator?.tables}
          icon={<GridLineIcon size={24} />}
        />
        <TopCards
          label="Үзүүлэлт"
          value={mainIndicator?.indicators}
          icon={<PulseLineIcon size={24} />}
        />
        <TopCards
          label="Ангилал, код"
          value={mainIndicator?.classifications}
          icon={<BarcodeBoxLineIcon size={24} />}
        />
        <TopCards
          label="Маягт"
          value={mainIndicator?.forms}
          icon={<EditBoxFillIcon size={24} />}
        />
      </Grid2>
      {/* <Grid2 container spacing={3} mt={1}>
        <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
          <BarChart />
        </Grid2>
      </Grid2> */}
    </Box>
  );
};
export default StatListComponent;
