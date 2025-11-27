"use client";
import { ITable } from "@/interfaces/ITable";
import { TreeItem2 } from "@mui/x-tree-view/TreeItem2";
import { ListGroup } from "flowbite-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { listGroupDetailSidebarTheme } from "../componentTheme/ListGroupTheme";
import ListGroupItem from "./ListGroupItem";
import SearchTextInput from "./SearchTextInput";
import TreeItemClassification from "./TreeItemClassification";
import TreeItemIndicator from "./TreeItemIndicator";

type TreeItemTableProps = {
  id: number;
  db_id: number;
  db_name: string;
  tables: ITable[];
};

const TreeItemTable = ({ id, db_id, db_name, tables }: TreeItemTableProps) => {
  const [tblSearchText, setTblSearchText] = useState("");
  const [showMore, setShowMore] = useState(false);

  const pathname = usePathname();
  const path = pathname.split("/");

  const handleSearchTextChange = (e: any) => {
    setTblSearchText(e.target.value);
  };

  const handleSearchCancel = () => {
    setTblSearchText("");
  };

  const tbls =
    tblSearchText == ""
      ? tables
      : tables?.filter((item: ITable) => {
          return item?.name
            ?.toLowerCase()
            .includes(tblSearchText.toLowerCase());
        });

  return (
    <TreeItem2
      itemId={"db-" + db_id}
      label={db_name + " (" + tables.length + ")"}
      classes={{ root: "p-4" }}
    >
      <ListGroup theme={listGroupDetailSidebarTheme} className=" ml-2">
        <SearchTextInput
          text="Хүснэгтийн нэрээр хайх"
          dbSearchText={tblSearchText}
          handleSearchCancel={handleSearchCancel}
          handleSearchTextChange={handleSearchTextChange}
        />
        {tbls
          ?.filter(({ is_active }) => is_active)
          ?.map(
            ({ id: tbl_id, name: tbl_name, indicators }: any, i: number) => {
              let classifications = [];
              if (path[1] == "classification") {
                classifications = Array.from(
                  new Set(
                    indicators
                      ?.filter(
                        (fData: any) =>
                          fData?.indicators_classifications.length > 0
                      )
                      .map(
                        (ind: any) =>
                          ind.indicators_classifications[0]?.classification_id
                      )
                  )
                ).map((classification_id) => {
                  return (
                    classification_id &&
                    indicators?.find(
                      (ind: any) =>
                        ind?.indicators_classifications[0]?.classification_id ==
                        classification_id
                    )?.indicators_classifications[0]?.classification
                  );
                });
              }
              return (
                <>
                  <div key={i}>
                    <>
                      {path[1] == "indicator" && (
                        <TreeItemIndicator
                          id={id}
                          tbl_id={tbl_id}
                          tbl_name={tbl_name}
                          pathName={path[1]}
                          indicators={indicators}
                        />
                      )}
                    </>
                    {path[1] == "classification" && (
                      <TreeItemClassification
                        id={id}
                        tbl_id={tbl_id}
                        tbl_name={tbl_name}
                        pathName={path[1]}
                        classifications={classifications}
                      />
                    )}
                    {path[1] == "table" && (
                      <>
                        {i < 10 && (
                          <ListGroupItem
                            id={tbl_id}
                            name={tbl_name}
                            activeId={id}
                            pathName="table"
                            total={indicators?.length}
                          />
                        )}
                        {i > 9 && showMore && (
                          <ListGroupItem
                            id={tbl_id}
                            name={tbl_name}
                            activeId={id}
                            pathName="table"
                            total={indicators?.length}
                          />
                        )}
                      </>
                    )}
                  </div>
                </>
              );
            }
          )}
        {path[1] == "table" && tbls.length > 5 && (
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

export default TreeItemTable;
