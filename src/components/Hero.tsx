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
          <h1 className="text-white text-[42px] font-sans italic w-full lg:w-[800px]">
            Төрийн мета өгөгдлийн нэгдсэн сан
          </h1>
          <p className="text-[18px] font-normal text-justify text-white opacity-90 px-1">
          Энэхүү цахим хуудас нь төрийн байгууллагуудын үүсгэсэн<br />
          өгөгдлийг багц (мэдээллийн сан), хүснэгт, үзүүлэлт, ангилал, код,<br />
          тэдгээрийг цуглуулж байгаа маягт, асуулгын хуудасны мета<br />
          элементүүдийг харуулах, өгөгдлийн сангийн үзүүлэлт, түүнд<br />
          ашиглаж байгаа ангилал, кодын уялдааг харах зорилготой.
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
