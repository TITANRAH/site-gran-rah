import type { ProductMusic } from "@/types";

export interface ProcessedAlbum {
  albumTitle: string;
  isForSale: boolean;
  price: number;
  description: string;
  spotifyUrl: string;
  youtubeUrl: string;
  albumImage: string;
  formattedPrice: string;
  whatsappUrl: string;
  slug: string;
}

export function processAlbumData(album: ProductMusic, whatsappNumber: string): ProcessedAlbum {
  const albumTitle = album.title.rendered;
  let isForSale = false;
  let price: number = 0;
  let description = "";
  let spotifyUrl = "";
  let youtubeUrl = "";
  let albumImage = "";

  if (album.acf && !Array.isArray(album.acf)) {
    isForSale = album.acf.sale || false;
    price = typeof album.acf.price === 'number'
      ? album.acf.price
      : (typeof album.acf.price === 'string' ? parseFloat(album.acf.price) : 0);
    description = album.acf.description || "";
    spotifyUrl = album.acf.url_spotify || "";
    youtubeUrl = album.acf.url_youtube || "";

    if (album.acf.product_image && typeof album.acf.product_image === 'object' && 'large' in album.acf.product_image) {
      albumImage = album.acf.product_image.large.url;
    }
  }

  if (!albumImage && album.featured_images && typeof album.featured_images === 'object' && 'large' in album.featured_images) {
    albumImage = album.featured_images.large.url;
  }

  const formattedPrice = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(price);

  const whatsappMessage = encodeURIComponent(
    `Hola! Me interesa el disco "${albumTitle}" por ${formattedPrice}. ¿Está disponible?`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return {
    albumTitle,
    isForSale,
    price,
    description,
    spotifyUrl,
    youtubeUrl,
    albumImage,
    formattedPrice,
    whatsappUrl,
    slug: album.slug,
  };
}
