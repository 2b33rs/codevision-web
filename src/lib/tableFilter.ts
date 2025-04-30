import fuzzysort from "fuzzysort";

export function globalFilterFn(
  row: any,
  _columnId: string,
  filterValue: string,
) {
  const values = Object.values(row.original).filter(
    (v) => typeof v === "string" || typeof v === "number",
  );

  const haystack = values.map(String).join(" ");
  return !!fuzzysort.single(filterValue, haystack);
}
