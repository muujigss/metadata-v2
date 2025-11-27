import React, { useState } from "react";
import { IIndicator } from "@/interfaces/IIndicators";
import DataGridComponent from "../DataGridComponent";
import TableSidebarByUser from "../table/TableSidebarByUser";
import { Box } from "@mui/material";
import { IClassification } from "@/interfaces/IClassification";
import ClassDetailData from "./ClassDetailData";
import { IIndicatorClassification } from "@/interfaces/IIndicatorsClassifications";
import Grid from "@mui/material/Grid2";
const ClassificationListByUser = ({
  tblId,
  data,
}: {
  tblId: number;
  data: any;
}) => {
  const [open, setOpen] = useState(false);
  const [classId, setClassId] = useState<number>(0);
  const classificationList: any = Array.from(
    new Set(
      data
        ?.filter((fi: any) => fi?.indicators_classifications?.length > 0)
        ?.map((ind: any) => {
          return ind?.indicators_classifications?.map(
            (item: any) => item?.classification
          );
        })
    )
  ).flat();

  const classifications = Array.from(
    new Set(
      data
        ?.filter((fData: any) => fData?.indicators_classifications.length > 0)
        .map((ind: any) => ind.indicators_classifications[0]?.classification_id)
    )
  ).map((classification_id: any) => {
    return (
      classification_id &&
      data?.find(
        (ind: any) =>
          ind?.indicators_classifications.length > 0 &&
          ind?.indicators_classifications[0]?.classification_id ==
            classification_id
      )?.indicators_classifications[0]?.classification
    );
  });

  const columns = [
    { field: "id", headerName: "№", width: 70 },
    { field: "name", headerName: "Ангиллын нэр", width: 200 },
    {
      field: "is_active",
      headerName: "Идэвхтэй эсэх",
      width: 20,
    },
  ];

  const rowData = classificationList?.map((item: any) => {
    return {
      id: item?.id,
      name: item?.name,
      is_active: item?.is_active,
    };
  });

  const handleClick = (id: number) => {
    setOpen(true);
    setClassId(id);
  };
  const indicatorData = data?.filter(
    (fi: IIndicator) =>
      fi?.indicators_classifications &&
      fi?.indicators_classifications?.length > 0 &&
      fi?.indicators_classifications?.filter(
        (ind: IIndicatorClassification) => {
          return ind?.classification_id == classId;
        }
      )
  );

  return (
    <Grid container>
      <Grid size={{ xs: 6, md: 5 }}>
        <DataGridComponent
          data={rowData}
          columns={columns}
          handleClick={handleClick}
          listId={classId}
        />
      </Grid>
      <Grid size={{ xs: 6, md: 7 }}>
        {open ? (
          <ClassDetailData
            id={classId}
            setOpen={setOpen}
            indicatorData={indicatorData}
          />
        ) : (
          <TableSidebarByUser tblId={tblId} tableCheck={true} />
        )}
      </Grid>
    </Grid>
  );
};
export default ClassificationListByUser;
