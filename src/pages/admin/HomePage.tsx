import Announcement from "@/components/widget/admin/Announcement";
import CurrentFacility from "@/components/widget/admin/CurrentFacility";
import FundMutationLineChart from "@/components/widget/admin/FundMutationLineChart";
import OfficialContact from "@/components/widget/admin/OfficialContact";
import PageContainer from "@/components/widget/PageContainer";
import PopulationGrowthLineChart from "@/components/widget/PopulationGrowthLineChart";
import TotalCounter from "@/components/widget/TotalCounter";
import CurrentPopulationDonutChart from "@/components/widget/admin/CurrentPopulationDonutChart";
import VillageSummary from "@/components/widget/admin/VillageSummary";
import VisionMission from "@/components/widget/admin/VisionMission";
import { R_GAP } from "@/constants/sizes";
import { HStack } from "@chakra-ui/react";
import IncomeSourceDonutChart from "@/components/widget/admin/IncomeSourceDonutChart";
import ExpenseCategoryDonutChart from "@/components/widget/admin/ExpenseCategoryDonutChart";
import CurrentInventory from "@/components/widget/admin/CurrentInventory";

const DashboardPage = () => {
  return (
    <PageContainer gap={R_GAP} pb={4}>
      <HStack wrap={"wrap"} gap={R_GAP} align={"stretch"}>
        <VillageSummary flex={"1 1 650px"} />
        <TotalCounter flex={"1 1 300px"} />

        <Announcement flex={"1 1 300px"} minW={0} />
        <VisionMission flex={"1 1 300px"} minW={0} />
        <OfficialContact flex={"1 1 300px"} minW={0} />

        <FundMutationLineChart flex={"1 1 650px"} />
        <IncomeSourceDonutChart flex={"1 1 300px"} />

        <ExpenseCategoryDonutChart flex={"1 1 300px"} />
        <CurrentInventory flex={"1 1 300px"} />
        <CurrentFacility flex={"1 1 300px"} />

        <PopulationGrowthLineChart flex={"1 1 650px"} />
        <CurrentPopulationDonutChart flex={"1 1 300px"} />
      </HStack>
    </PageContainer>
  );
};

export default DashboardPage;
