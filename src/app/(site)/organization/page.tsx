import BreadCrumpMenu from "@/components/BreadCrumpMenu";
import OrgList from "@/components/organization/OrgList";
// export const revalidate = 3600;
const OrgPage = () => {
  return (
    <div className="container m-auto p-6 lg:px-8 flex min-h-screen flex-col items-start justify-start ">
      <BreadCrumpMenu menu_name="Байгууллагууд" id={6} />
      <OrgList />
    </div>
  );
};

export default OrgPage;
