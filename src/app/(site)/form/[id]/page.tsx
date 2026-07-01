import FormDetail from "@/components/form/FormDetail";

const FormPage = async ({ params }: { params: Promise<{ id: number }> }) => {
  const { id } = await params;

  return (
    <div className="container m-auto p-6 lg:px-8 flex min-h-screen flex-col items-start justify-start">
      <FormDetail id={id} />
    </div>
  );
};

export default FormPage;
