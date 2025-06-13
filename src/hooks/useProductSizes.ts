import { useEffect, useState, useMemo } from "react";
import { mawiApi } from "@/api/endpoints/mawiApi.ts";

const DEFAULT_SIZES = ["S", "M", "L", "XL"];

export const useProductSizes = () => {
  const [sizes, setSizes] = useState<string[]>(DEFAULT_SIZES);

  const { data: categoryData } = mawiApi.useGetCategoriesQuery();

  const apiSizes = useMemo(
    () => categoryData?.flatMap((item) => item.groessen) ?? [],
    [categoryData],
  );

  useEffect(() => {
    if (apiSizes && apiSizes.length > 0) {
      const mergedSizes = [...DEFAULT_SIZES, ...apiSizes];
      const uniqueSizes = Array.from(new Set(mergedSizes));
      setSizes(uniqueSizes);
    }
  }, [apiSizes]);

  return sizes;
};
