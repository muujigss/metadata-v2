"use client";
import React from "react";
import { Box, Card, Select, Tooltip, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { SearchService } from "@/services/SearchService";
import Loader from "@/components/Loader";
import Link from "next/link";
import PulseLineIcon from "remixicon-react/PulseLineIcon";
import DashboardCard from "./DashBoardCard";
import { Autocomplete } from "../theme/AutoSelectTheme";
import AutocompleteIntroduction from "../form/SearchSelectComponent";
import TreeView from "./TreeView";
import { getConvertTreeView } from "@/utils/dashboardConvertData";

const ElasticData = ({ indicatorTree }: any) => {
  // console.log({ indicatorTree });

  const [active, setActive] = React.useState("");
  const [activeId, setActiveId] = React.useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["search data", active],
    queryFn: () => SearchService(active.trim()),
  });
  // console.log({ data });

  const checkObj = (d: any, cc: any) => {
    if (d) {
      return Object.keys(d).includes(cc);
    }
  };
  if (
    !checkObj(data, "database") &&
    !checkObj(data, "table") &&
    !checkObj(data, "form") &&
    !checkObj(data, "indicator") &&
    !checkObj(data, "classification")
  )
    return (
      <div className="w-full text-center">
        <p className="pb-4">Хайлтын үр дүн олдсонгүй</p>
        <hr />
      </div>
    );

  const indicator: any =
    data.indicator &&
    data.indicator.filter(
      (e: { highlight: { indicator_name: any } }) => e.highlight.indicator_name
    );

  // console.log({ indicator });

  const indicator_covert = indicator
    ?.filter((dt: any) => dt?._source?.indicator_name)
    .map((dt: any) => {
      return {
        name: dt?._source?.indicator_name,
        children: [
          {
            name: dt._source?.tbl_name,
            children: [
              {
                name: dt._source?.db_name,
                itemStyle: {
                  color: "#1C45F4",
                },
                lineStyle: {
                  color: "#408FC9",
                },
                label: {
                  show: true,
                  width: 100,
                  overflow: "breakAll",
                  borderRadius: 5,
                  backgroundColor: "#408FC9",
                  color: "#fff",
                  padding: 5,
                  fontSize: 9,
                },
              },
            ],
            itemStyle: {
              color: "#1431AD",
            },
            lineStyle: {
              color: "#B9C5FC",
            },
            label: {
              show: true,
              width: 110,
              overflow: "breakAll",
              borderRadius: 5,
              backgroundColor: "#B9C5FC",
              color: "#000",
              padding: 5,
              fontSize: 9,
            },
          },
        ],
        itemStyle: {
          color: "#D79034",
        },
        lineStyle: {
          color: "#F2BE7A",
          width: 2,
          type: "solid",
        },
        label: {
          show: true,
          width: 60,
          overflow: "breakAll",
          borderRadius: 5,
          backgroundColor: "#F2BE7A",
          color: "#000",
          padding: 5,
          fontSize: 9,
        },
      };
    });

  if (isLoading) return <Loader />;
  return (
    <Box sx={{ height: "h-screen" }}>
      {active == "" ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h6">Үзүүлэлт сонгох</Typography>
          <AutocompleteIntroduction
            options={indicatorTree?.map((e: any) => {
              return {
                id: e.id,
                name: e.name,
              };
            })}
            name="active"
            onchange={(e: any, newValue: any) => {
              if (newValue == null) {
                setActive("");
              } else {
                setActive(newValue.name);
                setActiveId(newValue.id);
              }
            }}
            values={activeId}
            errors={""}
          />
        </Box>
      ) : (
        <Box>
          {checkObj(data, "indicator") && indicator.length > 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <AutocompleteIntroduction
                options={indicatorTree?.map((e: any) => {
                  return {
                    id: e.id,
                    name: e.name,
                  };
                })}
                name="active"
                onchange={(e: any, newValue: any) => {
                  if (newValue == null) {
                    setActive("");
                  } else {
                    setActiveId(newValue.id);
                    setActive(newValue.name);
                  }
                }}
                values={activeId}
                errors={""}
              />
              <TreeView data={indicator_covert} activeName={active} />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ElasticData;
