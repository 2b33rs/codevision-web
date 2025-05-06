import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import { ReactNode } from "react";

interface TabObject {
  title: string;
  content: ReactNode;
}

const BaseTabsLayout = ({ tabs }: { tabs: TabObject[] }) => {
  return (
    <Tabs defaultValue={tabs[0].title} className={"flex-1"}>
      <TabsList>
        {tabs.map((tab, index) => (
          <TabsTrigger key={index} value={tab.title}>
            {tab.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab, index) => (
        <TabsContent key={index} value={tab.title}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default BaseTabsLayout;
