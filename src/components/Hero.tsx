"use client";
import Image from "next/image";
import OrgSlideList from "./organization/OrgSlideList";
import Search from "./search/Index";
import SectorSlide from "./sector/SectorSlide";
import StatComponent from "./StatComponent";

const Hero = ({ mainIndicator }: any) => {
  return (
    <section>
      <div className=" flex flex-wrap lg:flex-nowrap items-center container mx-auto justify-center self-stretch gap-6 lg:gap-52 py-8 px-10">
        <div className="flex flex-col items-start justify-between gap-4 w-auto">
          <h1 className="uppercase text-text-home-title bg-gradient-to-t from-primary-default to-tertirary-high bg-clip-text text-transparent ">
            Төрийн мета өгөгдлийн нэгдсэн сан
          </h1>
          <p className="text-text-body-medium text-justify text-secondary-default opacity-80 px-1">
            Энэхүү цахим хуудас нь төрийн байгууллагуудын үүсгэсэн өгөгдлийг
            багц (мэдээллийн сан), хүснэгт, үзүүлэлт, ангилал, код, тэдгээрийг
            цуглуулж байгаа маягт, асуулгын хуудасны мета элементүүдийг
            харуулах, өгөгдлийн сангийн үзүүлэлт, түүнд ашиглаж байгаа ангилал,
            кодын уялдааг харах зорилготой.
          </p>
          <Search />
        </div>

        <div className="w-2/3">
          <Image
            src="/logo/home_mb.png"
            alt="hero"
            width={195}
            height={256}
            className="object-contain w-auto h-auto"
            quality={100}
          />
        </div>
      </div>
      <StatComponent mainIndicator={mainIndicator} />
      <OrgSlideList />
      <SectorSlide />
    </section>
  );
};

export default Hero;
