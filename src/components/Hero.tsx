"use client";
import Image from "next/image";
import OrgSlideList from "./organization/OrgSlideList";
import Search from "./search/Index";
import SectorSlide from "./sector/SectorSlide";
import StatComponent from "./StatComponent";

const Hero = ({ mainIndicator }: any) => {
  return (
    <section className="relative overflow-hidden">
      <div className=" flex flex-wrap lg:flex-nowrap items-center container mx-auto justify-center self-stretch gap-6 lg:gap-52 py-8 px-10">
        <div className="flex flex-col items-start justify-between gap-4 w-auto mt-[120px]">
          <h1 className="text-white text-[42px] font-sans italic w-[800px]">
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

        <div className="w-2/3">
          {/* <Image
            src="/logo/home_mb.png"
            alt="hero"
            width={195}
            height={256}
            className="object-contain w-auto h-auto"
            quality={100}
          /> */}
        </div>
      </div>
      <OrgSlideList />
      <StatComponent mainIndicator={mainIndicator} />
      {/* <SectorSlide /> */}
    </section>
  );
};

export default Hero;
