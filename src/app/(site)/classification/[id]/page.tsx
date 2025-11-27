"use client";
import BreadCrumpMenu from "@/components/BreadCrumpMenu";
import ClassificationDetail from "@/components/classification/ClassificationDetail";
import ClassificationTabList from "@/components/classification/ClassificationTabList";
import Loader from "@/components/Loader";
import { getClassificationId } from "@/services/ClassificationService";
import { useQuery } from "@tanstack/react-query";

const ClassificationDetailPage = ({ params }: { params: { id: number } }) => {
  const id = { params }.params.id;

  const { data, isLoading, error } = useQuery({
    queryKey: ["getClassificationId.id", id],
    queryFn: () => getClassificationId(id),
  });

  if (error) return <p>Алдаа гарлаа ...</p>;
  if (isLoading) return <Loader />;

  return (
    <div className="container m-auto p-6 lg:px-8">
      <ClassificationTabList data={data} />
    </div>
  );
};
export default ClassificationDetailPage;
