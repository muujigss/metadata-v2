import { ListGroup } from "flowbite-react";
import { useRouter } from "next/navigation";

type ListGroupItemProps = {
  id: string | number;
  name: string;
  activeId: string | number;
  pathName: string;
  total?: number;
};
const ListGroupItem = ({
  id,
  name,
  activeId,
  pathName,
  total,
}: ListGroupItemProps) => {
  const router = useRouter();

  const goTo = () => {
    router.push(`/${pathName}/` + id);
  };

  return (
    <ListGroup.Item
      onClick={goTo}
      className={`${
        pathName == "table" ||
        pathName == "indicator" ||
        pathName == "classification" ||
        pathName == "form"
          ? ""
          : "border-b"
      } ${
        id == activeId
          ? "active bg-secondary-background"
          : " text-text-body-medium2"
      }`}
    >
      <p className="p-1 text-start">{name} </p>
    </ListGroup.Item>
  );
};

export default ListGroupItem;
