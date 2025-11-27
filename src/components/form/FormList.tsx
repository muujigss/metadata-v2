// import { getFormsModel } from "@/services/model/FormModel";
import { getFormsModel } from "@/services/model/site/FormModel";
import Loader from "../Loader";
import PaginationComp from "../PaginationComp";
import FormItem from "./FormItem";

export default async function FormList({
  currentPage,
  searchText,
  orgId,
  sectorId,
}: {
  currentPage: number;
  searchText: string;
  orgId: string;
  sectorId: string;
}) {
  const take = 15;
  const skip = (currentPage - 1) * take;

  const data = await getFormsModel(+skip, take, currentPage, {
    form_name: searchText,
    orgId,
    sectorId,
  });

  if (!data) return <Loader />;
  if (data?.data?.length == 0) return <p>Хайлтын үр дүнд олдсонгүй ...</p>;

  return (
    <div className={"w-full h-full"}>
      <div className="flex items-center gap-2 justify-start pb-6 pt-2">
        Нийт:
        <span className="text-primary-default text-text-title-medium">
          {data?.allresults}
        </span>
      </div>
      <div className="flex flex-col gap-4 self-stretch">
        {data?.data?.map(
          (
            {
              id,
              name,
              code,
              description,
              confirmed_date,
              database: {
                organization: { name: org_name },
              },
              frequency,
            }: any,
            i: any
          ) => {
            return (
              <FormItem
                key={i}
                {...{
                  id,
                  name,
                  description,
                  code,
                  confirmed_date,
                  org_name,
                  frequency,
                }}
              />
            );
          }
        )}
      </div>
      <PaginationComp
        currentPage={currentPage}
        totalPages={data?.allresults}
        perPage={data?.perPage}
        lastPage={data?.lastPage}
      />
    </div>
  );
}
