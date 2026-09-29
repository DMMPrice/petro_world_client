type ProductImageSource = {
  image_url?: string | null;
  images?: string[] | null;
  gallery_urls?: string[] | null;
};

export function getProductImages(product: ProductImageSource): string[] {
  return Array.from(
    new Set(
      [
        product.image_url,
        ...(product.gallery_urls ?? []),
        ...(product.images ?? []),
      ].filter((image): image is string => Boolean(image && image.trim()))
    )
  );
}
