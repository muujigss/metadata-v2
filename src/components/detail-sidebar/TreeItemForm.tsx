import { ListGroup } from "flowbite-react";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { listGroupTheme } from "../componentTheme/ListGroupTheme";
import { TreeItem2 } from "@mui/x-tree-view/TreeItem2";
import ListGroupItem from "./ListGroupItem";
import SearchTextInput from "./SearchTextInput";
import { IForm } from "@/interfaces/IForm";

type TreeItemFormProps = {
  id: number;
  db_id: number;
  db_name: string;
  forms: IForm[];
};

const TreeItemForm = ({ id, db_id, db_name, forms }: TreeItemFormProps) => {
  const [tblSearchText, setTblSearchText] = useState("");
  const pathname = usePathname();
  const path = pathname.split("/");
  const [showMore, setShowMore] = useState(false);

  const handleSearchTextChange = (e: any) => {
    setTblSearchText(e.target.value);
  };

  const handleSearchCancel = () => {
    setTblSearchText("");
  };

  const formList =
    tblSearchText == ""
      ? forms
      : forms?.filter((item: IForm) => {
          return item?.name.toLowerCase().includes(tblSearchText.toLowerCase());
        });
  return (
    <TreeItem2
      itemId={"db-" + db_id}
      label={db_name + " (" + forms?.length + ")"}
      className="p-4"
    >
      <ListGroup theme={listGroupTheme} className=" border-0 pl-4">
        <SearchTextInput
          text="Маягтын нэрээр хайх"
          dbSearchText={tblSearchText}
          handleSearchCancel={handleSearchCancel}
          handleSearchTextChange={handleSearchTextChange}
        />
        {formList
          ?.filter((item: IForm) => item?.is_active)
          ?.map(({ name: form_name, id: form_id }, i) => {
            return (
              <div key={i}>
                {i < 10 && (
                  <ListGroupItem
                    key={form_id}
                    id={form_id}
                    name={form_name}
                    activeId={id}
                    pathName="form"
                    total={0}
                  />
                )}
                {i > 9 && showMore && (
                  <ListGroupItem
                    key={form_id}
                    id={form_id}
                    name={form_name}
                    activeId={id}
                    pathName="form"
                    total={0}
                  />
                )}
              </div>
            );
          })}
        {formList?.length > 9 && (
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

export default TreeItemForm;
