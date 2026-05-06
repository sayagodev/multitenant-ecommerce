import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import type { SearchParams } from "nuqs";
import { loadProductFilters } from "@/modules/products/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { DEFAULT_LIMIT } from "@/constants";

interface Props {
  params: Promise<{ category: string; }>
  SearchParams: Promise<SearchParams>
}

const Page = async ({ params, SearchParams }: Props) => {
  const { category } = await params;
  const filters = await loadProductFilters(SearchParams)

  prefetch(trpc.products.getMany.infiniteQueryOptions(
    {
      ...filters,
      category,
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
      <ProductListView category={category} />
    </HydrateClient>
  )
}

export default Page;
