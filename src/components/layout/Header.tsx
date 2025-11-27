import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LogoPics from "./LogoPics";

const Header = () => {
  const [open, setOpen] = useState(false);
  const menus = [
    // { id: "0", menu_name: "Нүүр", link: "" },
    { id: "1", menu_name: "Өгөгдлийн сан", link: "database" },
    { id: "2", menu_name: "Хүснэгт", link: "table" },
    { id: "3", menu_name: "Үзүүлэлт", link: "indicator" },
    { id: "4", menu_name: "Ангилал, код", link: "classification" },
    { id: "5", menu_name: "Маягт", link: "form" },
    { id: "6", menu_name: "Мета өгөгдлийн дүрслэл", link: "chart" },
    { id: "7", menu_name: "Нэвтрэх", link: "login" },
  ];

  const pathName = usePathname();
  const paths = pathName.split("/");
  return (
    <header className="bg-white">
      <nav
        className="flex gap-10 mx-2 lg:mx-auto items-center justify-between p-4 lg:px-6"
        aria-label="Global"
      >
        <LogoPics />
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-6">
          {menus.map((menu) => (
            <a
              key={menu.id}
              href={"/" + menu.link}
              className={`uppercase text-sm font-normal xl:font-medium leading-4 xl:leading-6 text-text-org-name xl:text-text-body-large ${paths[1] == menu.link ? "menu-active" : "text-gray-900"
                }  hover:text-primary-medium "`}
            >
              {menu.menu_name}
            </a>
          ))}
        </div>
      </nav>
      {/* <!-- Mobile menu, show/hide based on menu open state. --> */}
      {open && (
        <div className="lg:hidden" role="dialog" aria-modal="true">
          {/* <!-- Background backdrop, show/hide based on slide-over state. --> */}
          <div className="fixed inset-0 z-50"></div>
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Үндэсний Статистикийн Хороо</span>
                <Image
                  className="object-none"
                  width={200}
                  height={200}
                  src="/logo.png"
                  alt=""
                  quality={100}
                  priority
                />
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="flex flex-col justify-center gap-4 my-6">
                {menus.map((menu) => (
                  <a
                    key={menu.id}
                    href={menu.link}
                    className=" text-sm font-semibold leading-6 text-gray-900 hover:text-primary-medium"
                  >
                    {menu.menu_name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;