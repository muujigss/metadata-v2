import type { CustomFlowbiteTheme } from "flowbite-react";

export const accordionTheme: CustomFlowbiteTheme["accordion"] = {
  root: {
    base: "divide-y divide-secondary-background border-secondary-background",
    flush: {
      off: "rounded-lg border",
      on: "border-b",
    },
  },
  content: {
    base: "first:rounded-t-lg last:rounded-b-lg bg-secondary-background",
  },
  title: {
    arrow: {
      base: "h-6 w-6 shrink-0 focus:ring-2 focus:ring-primary-default",
      open: {
        off: "",
        on: "rotate-180",
      },
    },
    base: "flex w-full items-center justify-between p-2 first:rounded-t-lg last:rounded-b-lg",
    flush: {
      off: "hover:bg-gray-100 focus:ring-2 focus:ring-primary-default focus:outline-none",
      on: "bg-transparent dark:bg-transparent",
    },
    heading: "",
    open: {
      off: "",
      on: "bg-gray-100 text-gray-900",
    },
  },
};

export const accordionSidebarDetailsTheme: CustomFlowbiteTheme["accordion"] = {
  root: {
    base: "divide-y divide-secondary-background border-secondary-background",
    flush: {
      off: "rounded-lg border",
      on: "border-b",
    },
  },
  content: {
    base: "p-5 first:rounded-t-lg last:rounded-b-lg bg-secondary-background",
  },
  title: {
    arrow: {
      base: "h-6 w-6 shrink-0 focus:ring-2 focus:ring-primary-default",
      open: {
        off: "",
        on: "rotate-180",
      },
    },
    base: "flex w-full items-center justify-between p-5 first:rounded-t-lg last:rounded-b-lg",
    flush: {
      off: "hover:bg-gray-100 focus:ring-2 focus:ring-primary-default focus:outline-none",
      on: "bg-transparent dark:bg-transparent",
    },
    heading: "",
    open: {
      off: "",
      on: "bg-gray-100 text-gray-900",
    },
  },
};
