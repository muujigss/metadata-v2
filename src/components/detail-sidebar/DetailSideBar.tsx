"use client";
import { IDatabase } from "@/interfaces/IDatabase";
import { IOrganization } from "@/interfaces/IOrganization";
import { getFormsByDbId } from "@/services/FormService";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { useQuery } from "@tanstack/react-query";
import { Accordion, ListGroup } from "flowbite-react";
import { usePathname } from "next/navigation";
import Loader from "../Loader";
import { accordionSidebarDetailsTheme } from "../componentTheme/AccordionTheme";
import { listGroupDetailSidebarTheme } from "../componentTheme/ListGroupTheme";
import ListGroupItem from "./ListGroupItem";
import TreeItemForm from "./TreeItemForm";
import TreeItemTable from "./TreeItemTable";
import { TreeItem2 } from "@mui/x-tree-view/TreeItem2";
import { IForm } from "@/interfaces/IForm";
type IDetailSideBarProps = {
  org_id?: number;
  database_id?: number;
  form_id?: number;
  tbl_id?: number;
  ind_id?: number;
  parent_id?: number;
  id?: number;
};

const DetailSideBar = ({
  database_id = 0,
  form_id = 0,
  tbl_id = 0,
  ind_id = 0,
  parent_id = 0,
  id,
}: IDetailSideBarProps) => {
  const pathname = usePathname();
  const path = pathname.split("/");
  const { data, isError, isLoading } = useQuery<IOrganization>({
    queryKey: ["getFormsByDbId by id", database_id, tbl_id, form_id],
    queryFn: () => getFormsByDbId(parent_id, form_id, tbl_id),
  });

  if (isError) return <p>Алдаа гарлаа !!</p>;
  if (isLoading) return <Loader />;

  if (!data) return <p>Алдаа гарлаа !!</p>;

  const { forms, db }: any = data;

  if (!forms || !db) return <p>Алдаа гарлаа !!</p>;

  return (
    <SimpleTreeView
      // onExpandedItemsChange={handleExpandedItemsChange}
      defaultExpandedItems={["db-" + parent_id, "tbl-" + tbl_id]}
      // expandedItems={expandedItems}
    >
      <Accordion
        className="border-0"
        theme={accordionSidebarDetailsTheme}
        alwaysOpen
        arrowIcon={false as any}
      >
        <Accordion.Panel>
          <Accordion.Title className="focus:ring-1 hover:bg-primary-high hover:text-primary-background">
            <span className="inline-flex items-center gap-10">
              Маягтын жагсаалт
            </span>
          </Accordion.Title>
          <Accordion.Content className=" text-text-body-medium2 p-4">
            <TreeItem2
              itemId={"db-" + db.id}
              label={db.name + " (" + forms.length + ")"}
              classes={{ root: "p-4" }}
            >
              <ListGroup theme={listGroupDetailSidebarTheme} className=" ml-2">
                {/* <SearchTextInput
                  text="Хүснэгтийн нэрээр хайх"
                  dbSearchText={tblSearchText}
                  handleSearchCancel={handleSearchCancel}
                  handleSearchTextChange={handleSearchTextChange}
                /> */}
                {/* <ListGroup theme={listGroupDetailSidebarTheme}> */}
                {data &&
                  forms?.map(({ id, name }: IForm, i: number) => {
                    return (
                      <>
                        <ListGroupItem
                          key={i}
                          id={id}
                          name={name}
                          activeId={form_id}
                          pathName="form"
                          total={0}
                        />
                      </>
                    );
                  })}
              </ListGroup>
            </TreeItem2>
            {/* <ListGroup theme={listGroupDetailSidebarTheme}>
              {data?.databases
                ?.filter((item: IDatabase) => item?.is_active)
                .map(({ id, name, tables, forms }: IDatabase, i: number) => {
                  return (
                    <div key={i}>
                      {path[1] == "form" && (
                        <TreeItemForm
                          id={form_id}
                          db_id={id}
                          db_name={name}
                          forms={forms}
                        />
                      )}
                      {(path[1] == "table" ||
                        path[1] == "indicator" ||
                        path[1] == "classification") && (
                        <TreeItemTable
                          id={path[1] == "table" ? tbl_id : ind_id}
                          db_id={id}
                          db_name={name}
                          tables={tables}
                        />
                      )}
                      {path[1] == "database" && (
                        <ListGroupItem
                          id={id}
                          name={name}
                          activeId={database_id}
                          pathName="database"
                          total={tables?.length}
                        />
                      )}
                    </div>
                  );
                })}
            </ListGroup> */}
          </Accordion.Content>
        </Accordion.Panel>
      </Accordion>
    </SimpleTreeView>
  );
};

export default DetailSideBar;
