import DbDetail from "@/components/database/DbDetail";

const IDPage = async ({ params }: { params: Promise<{ id: number }> }) => {
  const { id } = await params;

  return (
    <div className="container m-auto p-6 lg:px-8 flex">
      <DbDetail id={id} />
    </div>
  );
};

export default IDPage;
