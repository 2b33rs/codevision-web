import { useEffect, useState, useMemo } from "react";
import { mawiApi } from "@/api/endpoints/mawiApi.ts";

const DEFAULT_TYPES = ["V-Ausschnitt", "Oversize", "Top", "Sport", "Rundhals"];

export const useProductTypes = () => {
  const [types, setTypes] = useState<string[]>(DEFAULT_TYPES);

  const { data: categoryData } = mawiApi.useGetCategoriesQuery();

  const apiTypes = useMemo(
    () => categoryData?.flatMap((item) => item.typen) ?? [],
    [categoryData],
  );

  useEffect(() => {
    if (apiTypes && apiTypes.length > 0) {
      const mergedTypes = [...DEFAULT_TYPES, ...apiTypes];
      const uniqueTypes = Array.from(new Set(mergedTypes));
      setTypes(uniqueTypes);
    }
  }, [apiTypes]);

  return types;
};
