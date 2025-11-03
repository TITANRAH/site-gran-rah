import { z } from "astro:content";

const imageSchema = z.object({
  url: z.string(),
  width: z.number(),
  height: z.number(),
});

export const featuredImagesSchema = z.object({
  thumbnail: imageSchema,
  medium: imageSchema,
  medium_large: imageSchema,
  large: imageSchema,
  full: imageSchema,
});

export const baseWPSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.object({
    rendered: z.string(),
  }),
  content: z.object({
    rendered: z.string(),
  }),
  acf: z
    .union([
      z.object({
        subtitle: z.string().optional(),
      }),
      z.array(z.any()),
    ])
    .optional(),
  featured_images: featuredImagesSchema.optional(),
});

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});

export const CategoriesSlugSchema = z.array(
  CategorySchema.pick({
    slug: true,
  })
);

const CategoriesSchema = z.array(CategorySchema);

export const PostSchema = baseWPSchema
  .omit({
    acf: true,
  })
  .extend({
    date: z.string(),
    category_details: CategoriesSchema,
  });

export const PostsSchema = z.array(PostSchema);

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
    acf: z
      .union([
        z.object({
          destacada: z.boolean().optional(),
        }),
        z.array(z.any()),
      ])
      .optional(),
    featured_images: z.union([featuredImagesSchema, z.boolean()]).optional(),
  });

export const NewsListSchema = z.array(NewsSchema);

export const AlbumSchema = baseWPSchema.extend({
  acf: z.object({
    subtitle: z.string().optional(),
    release_date: z.string().optional(),
    spotify_url: z.string().optional(),
    apple_music_url: z.string().optional(),
    youtube_url: z.string().optional(),
  }),
});

export const AlbumsSchema = z.array(AlbumSchema);

export const galleryImageSchema = z.object({
  thumbnail: imageSchema,
  medium: imageSchema,
  large: imageSchema,
  full: imageSchema,
});

export const GalleryPageSchema = baseWPSchema
  .omit({
    acf: true,
    featured_images: true,
  })
  .extend({
    acf: z
      .union([
        z.object({
          title: z.string().optional(),
          image: z
            .union([featuredImagesSchema, z.number(), z.boolean()])
            .optional(),
        }),
        z.array(z.any()),
      ])
      .optional(),
    featured_images: z.union([featuredImagesSchema, z.boolean()]).optional(),
    gallery: z.array(galleryImageSchema).default([]),
  });

export const EventSchema = baseWPSchema
  .omit({ acf: true, featured_images: true })
  .extend({
    date: z.string(),
    acf: z.union([
      z.object({
        date: z.string().optional(),
        address: z.string().optional(),
        schedule: z.string().optional(),
        link: z.string().optional(),
      }),
      z.array(z.any()),
    ]),
    featured_images: z.union([featuredImagesSchema, z.boolean()]).optional(),
  });

export const EventsSchema = z.array(EventSchema);

export const BioPageSchema = baseWPSchema.omit({ acf: true }).extend({
  acf: z
    .union([
      z.object({
        subtitle: z.string().optional(),
        bio_short: z.string().optional(),
        social_instagram: z.string().optional(),
        social_spotify: z.string().optional(),
        social_youtube: z.string().optional(),
        social_twitter: z.string().optional(),
        social_facebook: z.string().optional(),
      }),
      z.array(z.any()),
    ])
    .optional(),
});

export const acfImageSchema = z.object({
  url: z.string(),
  title: z.string().optional(),
  alt: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export const acfGallerySchema = z.array(acfImageSchema);

export const momentSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string(),
});

export const HomePageSchema = baseWPSchema
  .omit({
    acf: true,
    featured_images: true,
  })
  .extend({
    acf: z
      .union([
        z.object({
          title: z.string().optional(),
          image: z
            .union([featuredImagesSchema, z.number(), z.boolean()])
            .optional(),
        }),
        z.array(z.any()),
      ])
      .optional(),
    featured_images: z.union([featuredImagesSchema, z.boolean()]).optional(),
  });

export const MomentsSchema = baseWPSchema
  .omit({
    acf: true,
    featured_images: true,
  })
  .extend({
    acf: z
      .union([
        z
          .object({
            title: z.string().optional(),
            image: z
              .union([featuredImagesSchema, z.number(), z.boolean()])
              .optional(),
          })
          .catchall(momentSchema),
        z.array(z.any()),
      ])
      .optional(),
    featured_images: z.union([featuredImagesSchema, z.boolean()]).optional(),
  });

const baseProductSchema = baseWPSchema
  .omit({
    acf: true,
    featured_images: true,
    content: true,
  })
  .extend({
    content: z
      .object({
        rendered: z.string(),
      })
      .optional(),
    featured_images: z.union([featuredImagesSchema, z.boolean()]).optional(),
    product_categories: z
      .union([z.array(z.number()), z.array(CategorySchema)])
      .optional(),
  });

export const ProductMusicSchema = baseProductSchema.extend({
  acf: z
    .union([
      z.object({
        sale: z.boolean().optional(),
        price: z.union([z.number(), z.string()]).optional(),
        description: z.string().optional(),
        product_image: z
          .union([featuredImagesSchema, z.number(), z.boolean()])
          .optional(),

        url_spotify: z.string().optional(),
        url_youtube: z.string().optional(),

        color: z.string().optional(),
        size: z.string().optional(),
        theme: z.string().optional(),
        visor: z.string().optional(),

        sizes: z.union([z.string(), z.array(z.string())]).optional(),
        colors: z.union([z.string(), z.array(z.string())]).optional(),
        material: z.string().optional(),
      }),
      z.array(z.any()),
    ])
    .optional(),
});

export const ProductClothingSchema = baseProductSchema.extend({
  acf: z
    .union([
      z.object({
        price: z.number().optional(),
        description: z.string().optional(),
        sizes: z.array(z.string()).optional(),
        colors: z.array(z.string()).optional(),
        product_image: z
          .union([featuredImagesSchema, z.number(), z.boolean()])
          .optional(),
      }),
      z.array(z.any()),
    ])
    .optional(),
});

export const ProductsMusicSchema = z.array(ProductMusicSchema);

export const ProductsClothingSchema = z.array(ProductClothingSchema);

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
