import { DEFAULT_LIMIT } from "@/constants";
import { loadProductFilters } from "@/modules/products/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { SearchParams } from "nuqs/server";

interface Props {
  params: Promise<{ subcategory: string; }>
  SearchParams: Promise<SearchParams>
}

const Page = async ({ params, SearchParams }: Props) => {
  const { subcategory } = await params;
  const filters = await loadProductFilters(SearchParams)

  prefetch(trpc.products.getMany.infiniteQueryOptions(
    {
      ...filters,
      category: subcategory,
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.docs.length > 0 ? lastPage.nextPage : undefined
      }
    }
  ))

  return (
    <HydrateClient>
      <ProductListView category={subcategory} />
    </HydrateClient>
  )
}

export default Page;
