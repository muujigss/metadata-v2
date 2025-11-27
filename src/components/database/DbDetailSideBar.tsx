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

const DbDetailSideBar = ({
  database_id = 0,
  form_id = 0,
  tbl_id = 0,
  ind_id = 0,
  parent_id = 0,
  id,
}: IDetailSideBarProps) => {
  const pathname = usePathname();
  const path = pathname.split("/");
  const { data, isError, isLoading } = useQuery({
    queryKey: ["getFormsByDbId by id", database_id, tbl_id, form_id],
    queryFn: () => getFormsByDbId(parent_id, form_id, tbl_id),
  });

  if (isError) return <p>Алдаа гарлаа !!</p>;
  if (isLoading) return <Loader />;

  if (!data) return <p>Алдаа гарлаа !!</p>;

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
              Өгөгдлийн сангийн жагсаалт
            </span>
          </Accordion.Title>
          <Accordion.Content className=" text-text-body-medium2 p-4">
            {/* <TreeItem2
              itemId={"db-" + db.id}
              label={db.name + " (" + databases.length + ")"}
              classes={{ root: "p-4" }}
            > */}
            <ListGroup theme={listGroupDetailSidebarTheme} className=" ml-2">
              {/* <SearchTextInput
                  text="Хүснэгтийн нэрээр хайх"
                  dbSearchText={tblSearchText}
                  handleSearchCancel={handleSearchCancel}
                  handleSearchTextChange={handleSearchTextChange}
                /> */}
              {/* <ListGroup theme={listGroupDetailSidebarTheme}> */}
              {data &&
                data?.map(({ id, name }: IDatabase, i: number) => {
                  return (
                    <>
                      <ListGroupItem
                        id={id}
                        name={name}
                        activeId={database_id}
                        pathName="database"
                        total={0}
                      />
                    </>
                  );
                })}
            </ListGroup>
          </Accordion.Content>
        </Accordion.Panel>
      </Accordion>
    </SimpleTreeView>
  );
};

export default DbDetailSideBar;
