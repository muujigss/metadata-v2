import BreadCrumpMenu from "@/components/BreadCrumpMenu";
import SectorList from "@/components/sector/SectorList";
// export const revalidate = 3600;
const SectorPage = () => {
  return (
    <div className="container m-auto p-6 lg:px-8  flex min-h-screen flex-col items-start justify-start ">
      <BreadCrumpMenu menu_name="Салбар" id={7} />
      <SectorList />
    </div>
  );
};

export default SectorPage;
