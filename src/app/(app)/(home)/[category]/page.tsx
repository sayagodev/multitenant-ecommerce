import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import type { SearchParams } from "nuqs";
import { loadProductFilters } from "@/modules/products/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";

interface Props {
  params: Promise<{ category: string; }>
  SearchParams: Promise<SearchParams>
}

const Page = async ({ params, SearchParams }: Props) => {
  const { category } = await params;
  const filters = await loadProductFilters(SearchParams)

  prefetch(trpc.products.getMany.queryOptions({ category, ...filters }))

  return (
    <HydrateClient>
      <ProductListView category={category} />
    </HydrateClient>
  )
}

export default Page;
