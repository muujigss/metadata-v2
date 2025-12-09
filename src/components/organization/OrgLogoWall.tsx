"use client";
import { IOrganization } from "@/interfaces/IOrganization";
import { useGetOrgs } from "@/utils/customHooks";
import Image from "next/image";
import React from "react";

const OrgLogoWall = () => {
  const { data: orgs } = useGetOrgs();
  const activeOrgs = orgs?.filter((o: IOrganization) => o.is_active && o.img_url) || [];

  // Duplicate the list to create a seamless infinite scroll effect
  const scrollingOrgs = [...activeOrgs, ...activeOrgs, ...activeOrgs];

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden relative">
      {/* Background with slight overlay */}
      {/* Background with slight overlay - Removed for transparency */}
      {/* <div className="absolute inset-0 bg-gradient-to-t from-[#080812] via-transparent to-[#080812] z-10 pointer-events-none"></div> */}
      
      <div className="flex flex-col gap-8 -rotate-12 scale-110 opacity-60 hover:opacity-100 transition-opacity duration-500">
        {/* Row 1 - Scroll Left */}
        <div className="flex gap-8 animate-scroll-left">
          {scrollingOrgs.map((org, idx) => (
            <LogoCard key={`r1-${idx}`} org={org} />
          ))}
        </div>

        {/* Row 2 - Scroll Right */}
        <div className="flex gap-8 animate-scroll-right">
          {scrollingOrgs.map((org, idx) => (
            <LogoCard key={`r2-${idx}`} org={org} />
          ))}
        </div>

        {/* Row 3 - Scroll Left */}
        <div className="flex gap-8 animate-scroll-left">
          {scrollingOrgs.map((org, idx) => (
            <LogoCard key={`r3-${idx}`} org={org} />
          ))}
        </div>
      </div>
      
       <style jsx>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-left {
          animation: scrollLeft 40s linear infinite;
        }
        .animate-scroll-right {
          animation: scrollRight 40s linear infinite;
        }
      `}</style>
    </div>
  );
};

const LogoCard = ({ org }: { org: IOrganization }) => (
  <div className="w-24 h-24 flex-shrink-0 bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center justify-center shadow-lg hover:scale-110 transition-transform hover:shadow-cyan-500/20 hover:bg-white/20 border border-white/5">
    <Image
      src={org.img_url || "/logo/no-image.png"}
      alt={org.name}
      width={64}
      height={64}
      className="object-contain w-full h-full drop-shadow-md"
    />
  </div>
);

export default OrgLogoWall;
