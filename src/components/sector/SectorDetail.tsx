"use client";
import { getSectorId } from "@/services/SectorService";
import { useQuery } from "@tanstack/react-query";
import BreadCrumpMenu from "../BreadCrumpMenu";
import Loader from "../Loader";
import DatabaseFilterList from "../database/DatabaseFilterList";
const SectorDetail = ({ id }: { id: number }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["sector by id", id],
    queryFn: () => getSectorId(id),
  });

  if (isLoading) return <Loader />;

  if (isError) return <p>Алдаа гарлаа </p>;

  return (
    <div className="w-full h-full">
      <BreadCrumpMenu
        menu_name="Салбар"
        id={7}
        submenu_id={id}
        submenu_name={data?.name}
      />
      <div className="container py-8">
        <DatabaseFilterList id={id} />
      </div>
    </div>
  );
};
export default SectorDetail;
