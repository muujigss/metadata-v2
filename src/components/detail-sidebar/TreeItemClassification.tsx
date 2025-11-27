import { IClassification } from "@/interfaces/IClassification";
import { TreeItem2 } from "@mui/x-tree-view/TreeItem2";
import { ListGroup } from "flowbite-react";
import { useState } from "react";
import { listGroupDetailSidebarTheme } from "../componentTheme/ListGroupTheme";
import ListGroupItem from "./ListGroupItem";
import SearchTextInput from "./SearchTextInput";

type TreeItemClassificationProps = {
  id: number;
  tbl_id: number;
  tbl_name: string;
  classifications: IClassification[];
  pathName: string;
};
const TreeItemClassification = ({
  id,
  tbl_id,
  tbl_name,
  classifications,
  pathName,
}: TreeItemClassificationProps) => {
  const [indicatorSearchText, setIndicatorSearchText] = useState("");
  const [showMore, setShowMore] = useState(false);
  const handleSearchTextChange = (e: any) => {
    setIndicatorSearchText(e.target.value);
  };

  const handleSearchCancel = () => {
    setIndicatorSearchText("");
  };

  const classifcationFilterList =
    indicatorSearchText == ""
      ? classifications
      : classifications?.filter((item: IClassification) => {
          return item?.name
            .toLowerCase()
            .includes(indicatorSearchText.toLowerCase());
        });

  return (
    <TreeItem2
      itemId={"tbl-" + tbl_id}
      label={tbl_name + " (" + classifications.length + ")"}
      className="p-4"
    >
      <ListGroup theme={listGroupDetailSidebarTheme} className="pl-4">
        <SearchTextInput
          text="Ангиллын нэрээр хайх"
          dbSearchText={indicatorSearchText}
          handleSearchCancel={handleSearchCancel}
          handleSearchTextChange={handleSearchTextChange}
        />
        {classifcationFilterList?.map(({ name, id: classificationId }, i) => {
          return (
            <>
              {i < 10 && (
                <ListGroupItem
                  key={tbl_id}
                  id={classificationId}
                  name={name}
                  activeId={id}
                  pathName={"classification"}
                  total={0}
                />
              )}
              {i > 9 && showMore && (
                <ListGroupItem
                  key={tbl_id}
                  id={classificationId}
                  name={name}
                  activeId={id}
                  pathName={"classification"}
                  total={0}
                />
              )}
            </>
          );
        })}
        {classifcationFilterList.length > 9 && (
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

export default TreeItemClassification;
