import type { CustomFlowbiteTheme } from "flowbite-react";

export const tabsTheme: CustomFlowbiteTheme["tabs"] = {
  base: "flex flex-col gap-2",
  tablist: {
    base: "flex text-center",
    styles: {
      default: "flex-wrap border-t-4 border-t-primary-default ",
      underline: "-mb-px flex-wrap border-t-4 border-t-primary-default ",
      pills:
        "flex-wrap space-x-2 text-text-body-meduim2 text-secondary-medium bg-tab-primary",
      fullWidth:
        "grid w-full grid-flow-col divide-x divide-x-tab-border text-text-body-meduim2 text-secondary-medium shadow",
    },
    tabitem: {
      base: "flex items-center justify-center text-text-body-meduim2 focus:outline-none first:ml-0 focus:border-t-4  focus:border-t-primary-default",
      styles: {
        default: {
          base: "rounded-t-lg",
          active: {
            on: "border-t-4 border-t-primary-default bg-tab-background text-primary-default",
            off: "text-gray-500 hover:bg-gray-50 hover:text-gray-600",
          },
        },
        underline: {
          base: "rounded-t-lg",
          active: {
            on: "active rounded-t-lg border-t-4 border-t-primary-default text-primary-default bg-tab-background ",
            off: "text-gray-500 hover:border-gray-300 hover:text-gray-600 ",
          },
        },
        pills: {
          base: "",
          active: {
            on: "rounded-lg bg-cyan-600 text-white",
            off: "rounded-lg hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white",
          },
        },
        fullWidth: {
          base: "ml-0 flex w-full rounded-none first:ml-0",
          active: {
            on: "active rounded-none bg-tab-background p-4 text-primary-default border-t-4 border-t-primary-default",
            off: "rounded-none bg-tab-primary text-text-body-meduim2 text-secondary-medium hover:bg-gray-50 hover:text-gray-700",
          },
        },
      },
      icon: "mr-2 h-5 w-5",
    },
  },
  tabitemcontainer: {
    base: "",
    styles: {
      default: "",
      underline: "",
      pills: "",
      fullWidth: "",
    },
  },
  tabpanel: "py-3",
};
