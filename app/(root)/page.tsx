import HowItWorks from "@/components/home/HowItWorks";
import LiveClassesSection from "@/components/home/LiveClassesSection";
import LiveGroupClasses from "@/components/home/LiveGroupClasses";
import MonthlyProgress from "@/components/home/MonthlyProgress";
import SmartAssignmentsHome from "@/components/home/SmartAssignmentsHome";
import SpeakMore from "@/components/home/SpeakMore";
import TeachersSection from "@/components/home/TeachersSection";
import TestsAndEvaluation from "@/components/home/TestsAndEvaluation";
import WhatYouGet from "@/components/home/WhatYouGet";
import Banner from "@/components/layout/Banner";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

const HomePage = () => {
  return (
    <div>
      <Banner />
      <LiveClassesSection />
      <TeachersSection />
      {/* <HowItWorks /> */}
      {/* <WhatYouGet /> */}
      <SpeakMore />
      {/* <LiveGroupClasses /> */}
      <MonthlyProgress />
      <SmartAssignmentsHome />
      {/* <WhatYouGet /> */}
      <TestsAndEvaluation />
    </div>
  );
};

export default HomePage;
