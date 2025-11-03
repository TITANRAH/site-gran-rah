import { z } from "astro:content";

// Schema para imágenes individuales
const imageSchema = z.object({
  url: z.string(),
  width: z.number(),
  height: z.number(),
});

// Schema para las diferentes versiones de imágenes destacadas
export const featuredImagesSchema = z.object({
  thumbnail: imageSchema,
  medium: imageSchema,
  medium_large: imageSchema,
  large: imageSchema,
  full: imageSchema,
});

// Schema base de WordPress con las propiedades comunes
export const baseWPSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.object({
    rendered: z.string(),
  }),
  content: z.object({
    rendered: z.string(),
  }),
  // ACF puede ser un objeto o un array vacío cuando no hay campos
  acf: z.union([
    z.object({
      subtitle: z.string().optional(),
    }),
    z.array(z.any()), // Array vacío cuando no hay campos ACF
  ]).optional(),
  featured_images: featuredImagesSchema.optional(),
});

// Esquema que define la estructura que debe tener cada categoría
export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});

// uso pick para que solo me devuelva el slug desde el schema de CategorySchema
export const CategoriesSlugSchema = z.array(
  CategorySchema.pick({
    slug: true,
  })
);

// Esquema que define la estructura que debe tener el array de categorías
const CategoriesSchema = z.array(CategorySchema);

// tomo todas las propiedades de la base pero quito acf
// definimos como sera cada post
// omit: Omite las propiedades que se le pasan como parámetros
export const PostSchema = baseWPSchema
  .omit({
    acf: true,
  })
  .extend({
    date: z.string(),
    category_details: CategoriesSchema, // Valor por defecto: array vacío
  });

// digo que es un array de PostSchema
// pero usamos esta constante que es un array de postSchema
export const PostsSchema = z.array(PostSchema);

// Schema para Noticias (News)
export const NewsSchema = baseWPSchema
  .omit({
    acf: true,
    featured_images: true,
  })
  .extend({
    date: z.string(),
    excerpt: z.object({
      rendered: z.string(),
    }),
    acf: z.union([
      z.object({
        destacada: z.boolean().optional(),
      }),
      z.array(z.any()),
    ]).optional(),
    featured_images: z.union([
      featuredImagesSchema,
      z.boolean(),
    ]).optional(),
  });

// Array de noticias
export const NewsListSchema = z.array(NewsSchema);

// Schema para álbumes
export const AlbumSchema = baseWPSchema.extend({
  acf: z.object({
    subtitle: z.string().optional(),
    release_date: z.string().optional(),
    spotify_url: z.string().optional(),
    apple_music_url: z.string().optional(),
    youtube_url: z.string().optional(),
  }),
});

// Schema para array de álbumes
export const AlbumsSchema = z.array(AlbumSchema);

// Schema para una imagen individual de la galería con todos sus tamaños
export const galleryImageSchema = z.object({
  thumbnail: imageSchema,
  medium: imageSchema,
  large: imageSchema,
  full: imageSchema,
});

// Schema para la página de galería
export const GalleryPageSchema = baseWPSchema
  .omit({
    acf: true,
    featured_images: true,
  })
  .extend({
    acf: z.union([
      z.object({
        title: z.string().optional(),
        image: z.union([
          featuredImagesSchema,
          z.number(),
          z.boolean(),
        ]).optional(),
      }),
      z.array(z.any()),
    ]).optional(),
    featured_images: z.union([
      featuredImagesSchema,
      z.boolean(),
    ]).optional(),
    // Campo gallery que viene del REST API personalizado
    gallery: z.array(galleryImageSchema).default([]),
  });

// Schema para eventos/conciertos
export const EventSchema = baseWPSchema
  .omit({ acf: true, featured_images: true })
  .extend({
    date: z.string(), // Fecha de publicación del post
    acf: z.union([
      z.object({
        date: z.string().optional(), // Fecha del evento (string formateado)
        address: z.string().optional(), // Dirección del evento
        schedule: z.string().optional(), // Horario del evento
        link: z.string().optional(), // Link de tickets
      }),
      z.array(z.any()), // Array vacío cuando no hay campos ACF
    ]),
    featured_images: z.union([
      featuredImagesSchema,
      z.boolean(),
    ]).optional(),
  });

export const EventsSchema = z.array(EventSchema);

// Schema para la página "Sobre Mí" / Biografía
export const BioPageSchema = baseWPSchema
  .omit({ acf: true })
  .extend({
    acf: z.union([
      z.object({
        subtitle: z.string().optional(),
        bio_short: z.string().optional(),
        social_instagram: z.string().optional(),
        social_spotify: z.string().optional(),
        social_youtube: z.string().optional(),
        social_twitter: z.string().optional(),
        social_facebook: z.string().optional(),
      }),
      z.array(z.any()), // Array vacío cuando no hay campos ACF
    ]).optional(),
  });

// Schema para la imagen de ACF con título
export const acfImageSchema = z.object({
  url: z.string(),
  title: z.string().optional(),
  alt: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
});

// Schema para galerías de imágenes de ACF (array)
export const acfGallerySchema = z.array(acfImageSchema);

// Schema para un momento individual
export const momentSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string(), // URL de la imagen
});

// Schema para la página de inicio
export const HomePageSchema = baseWPSchema
  .omit({
    acf: true,
    featured_images: true,
  })
  .extend({
    acf: z.union([
      z.object({
        title: z.string().optional(),
        image: z.union([
          featuredImagesSchema, // Objeto con diferentes tamaños de imagen
          z.number(), // ID de la imagen (fallback)
          z.boolean(), // false cuando no hay imagen
        ]).optional(),
      }),
      z.array(z.any()), // Array vacío cuando no hay campos ACF
    ]).optional(),
    // featured_images puede ser false cuando no hay imagen
    featured_images: z.union([
      featuredImagesSchema,
      z.boolean(),
    ]).optional(),
  });

// Schema para la página de Momentos
export const MomentsSchema = baseWPSchema
  .omit({
    acf: true,
    featured_images: true,
  })
  .extend({
    acf: z.union([
      z.object({
        title: z.string().optional(),
        image: z.union([
          featuredImagesSchema, // Objeto con diferentes tamaños de imagen
          z.number(), // ID de la imagen (fallback)
          z.boolean(), // false cuando no hay imagen
        ]).optional(),
      }).catchall(momentSchema), // Captura todos los momentos adicionales (moment_1, moment_2, etc.)
      z.array(z.any()), // Array vacío cuando no hay campos ACF
    ]).optional(),
    // featured_images puede ser false cuando no hay imagen
    featured_images: z.union([
      featuredImagesSchema,
      z.boolean(),
    ]).optional(),
  });

// Schema base para productos
const baseProductSchema = baseWPSchema
  .omit({
    acf: true,
    featured_images: true,
    content: true,
  })
  .extend({
    content: z.object({
      rendered: z.string(),
    }).optional(),
    featured_images: z.union([
      featuredImagesSchema,
      z.boolean(),
    ]).optional(),
    // product_categories puede ser un array de IDs (números) o un array de objetos CategorySchema
    product_categories: z.union([
      z.array(z.number()), // Array de IDs de categorías
      z.array(CategorySchema), // Array de objetos de categorías completos
    ]).optional(),
  });

// Schema universal para productos (música, gorras, poleras, etc.)
export const ProductMusicSchema = baseProductSchema.extend({
  acf: z.union([
    z.object({
      // Campos comunes
      sale: z.boolean().optional(), // Si el producto está disponible para venta
      price: z.union([z.number(), z.string()]).optional(), // Precio (puede venir como número o string)
      description: z.string().optional(), // Descripción HTML
      product_image: z.union([
        featuredImagesSchema, // Imagen procesada del producto
        z.number(), // ID de la imagen (fallback)
        z.boolean(), // false cuando no hay imagen
      ]).optional(),

      // Campos específicos de música
      url_spotify: z.string().optional(), // URL embed de Spotify
      url_youtube: z.string().optional(), // URL embed de YouTube

      // Campos específicos de gorras
      color: z.string().optional(), // Color de la gorra
      size: z.string().optional(), // Tamaño/dimensiones (ej: "80x20")
      theme: z.string().optional(), // Tema/diseño de la gorra
      visor: z.string().optional(), // Tipo de visera (plana, curva, etc.)

      // Campos específicos de ropa (poleras, polerones)
      sizes: z.union([z.string(), z.array(z.string())]).optional(), // Tallas disponibles (S, M, L, XL, etc.) - acepta string o array
      colors: z.union([z.string(), z.array(z.string())]).optional(), // Colores disponibles - acepta string o array
      material: z.string().optional(), // Material del producto
    }),
    z.array(z.any()), // Array vacío cuando no hay campos ACF
  ]).optional(),
});

// Schema para productos de ropa (futuro)
export const ProductClothingSchema = baseProductSchema.extend({
  acf: z.union([
    z.object({
      price: z.number().optional(), // Precio del producto
      description: z.string().optional(), // Descripción del producto
      sizes: z.array(z.string()).optional(), // Tallas disponibles (S, M, L, XL, etc.)
      colors: z.array(z.string()).optional(), // Colores disponibles
      product_image: z.union([
        featuredImagesSchema,
        z.number(),
        z.boolean(),
      ]).optional(),
    }),
    z.array(z.any()),
  ]).optional(),
});

// Schema para array de productos de música
export const ProductsMusicSchema = z.array(ProductMusicSchema);

// Schema para array de productos de ropa
export const ProductsClothingSchema = z.array(ProductClothingSchema);

// Exportar tipos TypeScript inferidos desde los schemas
export type Post = z.infer<typeof PostSchema>;
export type News = z.infer<typeof NewsSchema>;
export type Album = z.infer<typeof AlbumSchema>;
export type Event = z.infer<typeof EventSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type FeaturedImages = z.infer<typeof featuredImagesSchema>;
export type GalleryImage = z.infer<typeof galleryImageSchema>;
export type GalleryPage = z.infer<typeof GalleryPageSchema>;
export type BioPage = z.infer<typeof BioPageSchema>;
export type HomePage = z.infer<typeof HomePageSchema>;
export type MomentsPage = z.infer<typeof MomentsSchema>;
export type Moment = z.infer<typeof momentSchema>;
export type ACFImage = z.infer<typeof acfImageSchema>;
export type ACFGallery = z.infer<typeof acfGallerySchema>;
export type ProductMusic = z.infer<typeof ProductMusicSchema>;
export type ProductClothing = z.infer<typeof ProductClothingSchema>;
