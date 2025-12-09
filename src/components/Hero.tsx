"use client";
import ThreeDModel from "./ThreeDModel";
import OrgSlideList from "./organization/OrgSlideList";
import Search from "./search/Index";
import SectorSlide from "./sector/SectorSlide";
import StatComponent from "./StatComponent";

const Hero = ({ mainIndicator }: any) => {
  return (
    <section className="relative overflow-hidden">
      <div className="flex flex-wrap lg:flex-nowrap items-center w-full justify-between self-stretch gap-6 lg:gap-20 py-8 px-4 lg:px-24">
        <div className="flex flex-col items-center lg:items-start justify-between gap-4 w-auto mt-0 lg:mt-[120px]">
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-200 text-[32px] lg:text-[48px] xl:text-[56px] font-bold font-sans italic w-full lg:w-auto whitespace-nowrap leading-tight drop-shadow-lg">
            Төрөлжсөн бүртгэлийн нэгдсэн сан
          </h1>
          <p className="text-[16px] lg:text-[18px] font-medium text-justify text-gray-200 opacity-90 px-1 leading-relaxed max-w-2xl drop-shadow-md">
            "Суурь болон төрөлжсөн мэдээллийн сан, мета-өгөгдлийн нэгдсэн бүртгэл."
          </p>
        <Search />
      </div>

        <div className="w-full lg:w-1/2 flex justify-center items-center relative z-0">
          <ThreeDModel />
        </div>
      </div>
      <OrgSlideList />
      <StatComponent mainIndicator={mainIndicator} />
      {/* <SectorSlide /> */}
    </section>
  );
};

export default Hero;
