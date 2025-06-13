import { useEffect, useMemo, useState } from "react";
import { mawiApi } from "@/api/endpoints/mawiApi.ts";

const DEFAULT_CATEGORIES = ["T-Shirt"];

export const useProductCategories = () => {
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const { data: categoryData } = mawiApi.useGetCategoriesQuery();
  const apiCategories = useMemo(
    () => categoryData?.map((item) => item.kategorie) ?? [],
    [categoryData],
  );

  const mergeCategories = (apiData: string[]) => {
    const mergedCategories = apiData.includes("T-Shirt")
      ? apiData
      : [...DEFAULT_CATEGORIES, ...apiData];

    return Array.from(new Set(mergedCategories));
  };

  useEffect(() => {
    if (apiCategories && apiCategories.length > 0) {
      setCategories(mergeCategories(apiCategories));
    }
  }, [apiCategories]);

  return categories;
};
