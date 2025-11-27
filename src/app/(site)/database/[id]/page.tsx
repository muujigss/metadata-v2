import DbDetail from "@/components/database/DbDetail";

const IDPage = ({ params }: { params: { id: number } }) => {
  const id = { params }.params.id;

  return (
    <div className="container m-auto p-6 lg:px-8 flex">
      <DbDetail id={id} />
    </div>
  );
};

export default IDPage;
