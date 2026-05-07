import { DEFAULT_LIMIT } from "@/constants";
import { loadProductFilters } from "@/modules/products/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { SearchParams } from "nuqs/server";

interface Props {
  searchParams: Promise<SearchParams>;
  params: Promise<{ slug: string }>
}

const Page = async ({ params, searchParams }: Props) => {
  const { slug } = await params;
  const filters = await loadProductFilters(searchParams);

  prefetch(trpc.products.getMany.infiniteQueryOptions(
    {
      ...filters,
      tenantSlug: slug,
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
      <ProductListView tenantSlug={slug} narrowView />
    </HydrateClient>
  )

}

export default Page;
