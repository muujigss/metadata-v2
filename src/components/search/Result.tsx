import React from "react";
import Link from "next/link";
import Database2LineIcon from "remixicon-react/Database2LineIcon";
import Table2Icon from "remixicon-react/Table2Icon";
import EditBoxFillIcon from "remixicon-react/EditBoxFillIcon";
import PulseLineIcon from "remixicon-react/PulseLineIcon";
import BarcodeBoxLineIcon from "remixicon-react/BarcodeBoxLineIcon";

interface ResultProps {
  data: {
    databases?: any[];
    tables?: any[];
    forms?: any[];
    indicators?: any[];
    classifications?: any[];
  };
  query: string;
}

const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!text) return null;
  if (!highlight || !highlight.trim()) {
    return <span>{text}</span>;
  }
  try {
    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <span key={i} className="bg-yellow-200 text-black font-semibold rounded px-0.5">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  } catch (e) {
    return <span>{text}</span>;
  }
};

export default function Result({ data, query }: ResultProps) {
  const hasResults =
    (data.databases?.length || 0) > 0 ||
    (data.tables?.length || 0) > 0 ||
    (data.forms?.length || 0) > 0 ||
    (data.indicators?.length || 0) > 0 ||
    (data.classifications?.length || 0) > 0;

  if (!hasResults) {
    return (
      <div className="w-full text-center py-8 text-gray-500">
        <p className="text-lg font-medium">Хайлтын үр дүн олдсонгүй</p>
        <p className="text-sm">Өөр түлхүүр үгээр хайгаад үзнэ үү.</p>
      </div>
    );
  }

  const Section = ({ title, icon: Icon, items, linkPrefix }: any) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="mb-6 last:mb-0">
        <div className="flex items-center justify-between mb-2 px-2">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <Icon size={16} className="text-primary-default" />
            {title}
          </h3>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 divide-y divide-gray-100 overflow-hidden">
          {items.map((item: any) => (
            <Link
              key={item.id}
              href={`${linkPrefix}/${item.id}`}
              className="block p-3 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900 group-hover:text-primary-default transition-colors">
                    <HighlightText text={item.name} highlight={query} />
                  </div>
                  {item.code && (
                    <div className="text-xs text-gray-400 mt-0.5">
                      Code: <HighlightText text={item.code} highlight={query} />
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full text-left p-2">
      <Section
        title="Өгөгдлийн сан"
        icon={Database2LineIcon}
        items={data.databases}
        linkPrefix="/database"
      />
      <Section
        title="Хүснэгт"
        icon={Table2Icon}
        items={data.tables}
        linkPrefix="/table"
      />
      <Section
        title="Маягт"
        icon={EditBoxFillIcon}
        items={data.forms}
        linkPrefix="/form"
      />
      <Section
        title="Үзүүлэлт"
        icon={PulseLineIcon}
        items={data.indicators}
        linkPrefix="/indicator"
      />
      <Section
        title="Ангилал"
        icon={BarcodeBoxLineIcon}
        items={data.classifications}
        linkPrefix="/classification"
      />
    </div>
  );
}
