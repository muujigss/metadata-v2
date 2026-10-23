import Hero from "@/components/Hero";
import { getMainIndicatorModel } from "@/services/model/MainIndicatorModel";

// Counts change as organizations publish data; fetch them at request time.
export const dynamic = "force-dynamic";

export default async function Home() {
  const mainIndicator = await getMainIndicatorModel(true);
  return (
    <div>
      <Hero mainIndicator={mainIndicator} />
    </div>
  );
}
