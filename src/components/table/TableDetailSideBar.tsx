// "use client";
import { getFormsByDbId } from "@/services/FormService";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { useQuery } from "@tanstack/react-query";
import { Accordion, ListGroup } from "flowbite-react";
import Loader from "../Loader";
import { accordionSidebarDetailsTheme } from "../componentTheme/AccordionTheme";
import { listGroupDetailSidebarTheme } from "../componentTheme/ListGroupTheme";
import { ITable } from "@/interfaces/ITable";
import { TreeItem2 } from "@mui/x-tree-view/TreeItem2";
import ListGroupItem from "../detail-sidebar/ListGroupItem";
type IDetailSideBarProps = {
  org_id?: number;
  database_id?: number;
  form_id?: number;
  tbl_id?: number;
  ind_id?: number;
  parent_id?: number;
  id?: number;
};

const TableDetailSideBar = ({
  database_id = 0,
  form_id = 0,
  tbl_id = 0,
  ind_id = 0,
  parent_id = 0,
  id,
}: IDetailSideBarProps) => {
  // const pathname = usePathname();
  // const path = pathname.split("/");
  const { data, isError, isLoading } = useQuery<ITable>({
    queryKey: ["getFormsByDbId by id", database_id, tbl_id, form_id],
    queryFn: () => getFormsByDbId(parent_id, form_id, tbl_id),
  });

  if (isError) return <p>Алдаа гарлаа !!</p>;
  if (isLoading) return <Loader />;
  if (!data) return <p>Алдаа гарлаа !!</p>;

  const { tables, db } = data;

  if (!tables || !db) return <p>Алдаа гарлаа !!</p>;

  return (
    <SimpleTreeView defaultExpandedItems={["db-" + parent_id, "tbl-" + tbl_id]}>
      <Accordion
        className="border-0"
        theme={accordionSidebarDetailsTheme}
        alwaysOpen
        arrowIcon={false as any}
      >
        <Accordion.Panel>
          <Accordion.Title className="focus:ring-1 hover:bg-primary-high hover:text-primary-background">
            <span className="inline-flex items-center gap-10">
              Хүснэгтийн жагсаалт
            </span>
          </Accordion.Title>
          <Accordion.Content className=" text-text-body-medium2 p-4">
            <TreeItem2
              itemId={"db-" + db.id}
              label={db.name + " (" + tables.length + ")"}
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
                  tables?.map(({ id, name }: ITable, i: number) => {
                    return (
                      <>
                        <ListGroupItem
                          id={id}
                          name={name}
                          activeId={tbl_id}
                          pathName="table"
                          total={0}
                        />
                      </>
                    );
                  })}
              </ListGroup>
            </TreeItem2>
          </Accordion.Content>
        </Accordion.Panel>
      </Accordion>
    </SimpleTreeView>
  );
};

export default TableDetailSideBar;
