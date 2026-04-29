import { useQueryStates, parseAsString, parseAsArrayOf } from "nuqs"

const params = {
  minPrice: parseAsString
    .withOptions({
      clearOnDefault: true
    }),
  maxPrice: parseAsString
    .withOptions({
      clearOnDefault: true
    }),
  tags: parseAsArrayOf(parseAsString)
    .withOptions({
      clearOnDefault: true
    })
}

export const useProductFilters = () => {
  return useQueryStates(params)
}
