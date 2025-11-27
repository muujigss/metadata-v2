import { IIndicator } from "@/interfaces/IIndicators";
import { TreeItem2 } from "@mui/x-tree-view/TreeItem2";
import { ListGroup } from "flowbite-react";
import { useState } from "react";
import { listGroupDetailSidebarTheme } from "../componentTheme/ListGroupTheme";
import ListGroupItem from "./ListGroupItem";
import SearchTextInput from "./SearchTextInput";

type TreeItemIndicatorProps = {
  id: number;
  tbl_id: number;
  tbl_name: string;
  indicators: IIndicator[];
  pathName: string;
};
const TreeItemIndicator = ({
  id,
  tbl_id,
  tbl_name,
  indicators,
  pathName,
}: TreeItemIndicatorProps) => {
  const [indicatorSearchText, setIndicatorSearchText] = useState("");
  const [showMore, setShowMore] = useState(false);
  const handleSearchTextChange = (e: any) => {
    setIndicatorSearchText(e.target.value);
  };

  const handleSearchCancel = () => {
    setIndicatorSearchText("");
  };

  const indicatorFilterList =
    indicatorSearchText == ""
      ? indicators
      : indicators?.filter((item: IIndicator) => {
          return item?.name
            .toLowerCase()
            .includes(indicatorSearchText.toLowerCase());
        });

  return (
    <TreeItem2
      itemId={"tbl-" + tbl_id}
      label={tbl_name + " (" + indicators.length + ")"}
      className="p-4"
    >
      <ListGroup theme={listGroupDetailSidebarTheme} className="pl-4">
        <SearchTextInput
          text="Үзүүлэлтээр нэрээр хайх"
          dbSearchText={indicatorSearchText}
          handleSearchCancel={handleSearchCancel}
          handleSearchTextChange={handleSearchTextChange}
        />
        {indicatorFilterList?.map(
          ({ id, name, indicators_classifications }, i) => {
            return (
              <>
                {i < 10 && (
                  <ListGroupItem
                    key={tbl_id}
                    id={id}
                    name={name}
                    activeId={id}
                    pathName={"indicator"}
                    total={0}
                  />
                )}
                {i > 9 && showMore && (
                  <ListGroupItem
                    key={tbl_id}
                    id={id}
                    name={name}
                    activeId={id}
                    pathName={"indicator"}
                    total={0}
                  />
                )}
              </>
            );
          }
        )}
        {indicatorFilterList.length > 9 && (
          <p
            className=" text-center p-1 border-b text-primary-medium cursor-pointer"
            onClick={() => {
              setShowMore(!showMore);
            }}
          >
            {!showMore ? " Бүгдийг харах" : "Хураах"}
          </p>
        )}
      </ListGroup>
    </TreeItem2>
  );
};

export default TreeItemIndicator;
