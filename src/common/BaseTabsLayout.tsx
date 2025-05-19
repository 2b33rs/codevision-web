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
    <Tabs defaultValue={tabs[0].title} className="flex-1">
      <TabsList className="flex w-full justify-between bg-transparent p-0 shadow-none">

        <div className="flex gap-2 rounded-md bg-muted p-1">
          {tabs
            .filter((tab) => tab.title !== "Reklamation erfassen")
            .map((tab, index) => (
              <TabsTrigger key={index} value={tab.title}>
                {tab.title}
              </TabsTrigger>
            ))}
        </div>

        {tabs.some((tab) => tab.title === "Reklamation erfassen") && (
          <div className="flex gap-2 rounded-md bg-muted p-1">
            {tabs
              .filter((tab) => tab.title === "Reklamation erfassen")
              .map((tab, index) => (
                <TabsTrigger key={`right-${index}`} value={tab.title}>
                  {tab.title}
                </TabsTrigger>
              ))}
          </div>
        )}
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
