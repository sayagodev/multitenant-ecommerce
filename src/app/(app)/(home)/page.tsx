import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import type { SearchParams } from "nuqs";
import { loadProductFilters } from "@/modules/products/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { DEFAULT_LIMIT } from "@/constants";

interface Props {
  SearchParams: Promise<SearchParams>
}

const Page = async ({ SearchParams }: Props) => {
  const filters = await loadProductFilters(SearchParams)

  prefetch(trpc.products.getMany.infiniteQueryOptions(
    {
      ...filters,
      limit: DEFAULT_LIMIT
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.docs.length > 0 ? lastPage.nextPage : undefined
      }
    }
  ))

  return (
    <HydrateClient>
      <ProductListView />
    </HydrateClient>
  )
}

export default Page;
