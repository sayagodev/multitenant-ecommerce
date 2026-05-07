import { ProductView } from "@/modules/products/ui/views/product-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

interface Props {
  params: Promise<{ productId: string; slug: string }>
}

const Page = async ({ params }: Props) => {
  const { productId, slug } = await params

  prefetch(trpc.tenants.getOne.queryOptions({
    slug,
  }))

  return (
    <HydrateClient>
      <ProductView productId={productId} tenantSlug={slug} />
    </HydrateClient>
  )
}

export default Page
