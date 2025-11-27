import Hero from "@/components/Hero";
import { getMainIndicatorModel } from "@/services/model/MainIndicatorModel";

export default async function Home() {
  const mainIndicator = await getMainIndicatorModel(true);
  return (
    <div>
      <Hero mainIndicator={mainIndicator} />
    </div>
  );
}
