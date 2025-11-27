import React from "react";
import ListComponent from "@/components/admin/ListComponent";

type searchParamsProps = {
  org?: string;
  db?: string;
  type?: string;
};

const AdminPage = ({ searchParams }: { searchParams?: searchParamsProps }) => {
  const orgId = Number(searchParams?.org) || 1;
  const dbId = Number(searchParams?.db) || 1;

  return (
    <div className="w-full bg-primary-background">
      <ListComponent orgId={orgId} dbId={dbId} />
    </div>
  );
};
export default AdminPage;
