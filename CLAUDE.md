# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Language Preference

**IMPORTANT**: Always respond in Spanish (español) when working on this project. All user interactions, commit messages, comments, and documentation should be in Spanish.

## Project Overview

Static website for hip-hop artist Gran Rah, built with Astro 5 and TailwindCSS v4, consuming data from a WordPress backend via REST API. The site uses Zod schemas for runtime validation and TypeScript for compile-time type safety.

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server at localhost:4321
npm run build        # Build for production to ./dist/
npm run preview      # Preview production build locally
```

## Environment Setup

Copy `.env.example` to `.env.development` and configure WordPress URLs:

```env
API_URL=http://granrahback.local/wp-json/wp/v2
HOME_URL=http://granrahback.local/
```

The `API_URL` points to WordPress REST API v2 endpoint. The `HOME_URL` is used for WordPress media URLs.

## Architecture

### WordPress Integration Pattern

**IMPORTANTE**: Todas las llamadas HTTP deben seguir este patrón **sin try-catch**:

1. **Fetch from WordPress REST API** using `import.meta.env.API_URL`
2. **Validate with Zod schemas** from `src/types/index.ts`
3. **Parse and use type-safe data** in Astro components

**Patrón estándar** (sin manejo de errores):
```typescript
import { PostsSchema } from "@/types";

const url = `${import.meta.env.API_URL}/posts?per_page=1&_embed`;
const response = await fetch(url);
const json = await response.json();
const data = PostsSchema.parse(json); // Validated + typed
```

**NUNCA uses try-catch** en las llamadas HTTP. Deja que los errores se propaguen naturalmente y Astro los maneje.

**Ejemplo completo en una página**:
```typescript
// Para obtener una página por slug
const url = `${import.meta.env.API_URL}/pages?slug=inicio`;
const response = await fetch(url);
const json = await response.json();
const data = HomePageSchema.parse(json[0]);

// Para obtener posts
const postUrl = `${import.meta.env.API_URL}/posts`;
const postResponse = await fetch(postUrl);
const postJson = await postResponse.json();
const posts = PostsSchema.parse(postJson);
```

### Type System (`src/types/index.ts`)

**CONCEPTO IMPORTANTE**: Cada página/post type en WordPress tiene **campos ACF diferentes**, por lo que necesitas crear **schemas Zod específicos** para cada tipo de contenido.

#### Schemas Disponibles

All WordPress schemas are built with Zod and extend from `baseWPSchema`:

- **`baseWPSchema`**: Common WordPress fields (id, slug, title, content, acf, featured_images)
- **`PostSchema`**: Blog posts/news with date, excerpt, category_details
- **`AlbumSchema`**: Music albums with ACF fields (release_date, spotify_url, etc.)
- **`EventSchema`**: Concerts/events with ACF fields (event_date, location, venue, ticket_url)
- **`BioPageSchema`**: Biography page with social media links
- **`GalleryPageSchema`**: Photo gallery with image arrays
- **`HomePageSchema`**: Página de inicio with title and image (processed from ACF)

#### Cómo Crear un Nuevo Schema para una Página

Cuando agregas una nueva página en WordPress con campos ACF personalizados:

1. **Identifica los campos ACF** de la página en WordPress
2. **Crea un nuevo schema en `src/types/index.ts`** extendiendo `baseWPSchema`
3. **Define el tipo de cada campo ACF** (string, number, image object, gallery array, etc.)
4. **Si hay campos de imagen/galería**, actualiza `functions.php` para procesarlos

**Ejemplo**: Página con campos ACF `title`, `main_image`, y `description`:

```typescript
export const MyPageSchema = baseWPSchema
  .omit({ acf: true, featured_images: true })
  .extend({
    acf: z.union([
      z.object({
        title: z.string().optional(),
        main_image: z.union([
          featuredImagesSchema,  // Objeto procesado con URLs
          z.number(),            // ID (fallback)
          z.boolean(),           // false si no hay imagen
        ]).optional(),
        description: z.string().optional(),
      }),
      z.array(z.any()), // Array vacío cuando no hay ACF
    ]).optional(),
    featured_images: z.union([
      featuredImagesSchema,
      z.boolean(),
    ]).optional(),
  });

export type MyPage = z.infer<typeof MyPageSchema>;
```

**Importante**: Si el schema incluye campos de **imagen** o **galería**, debes actualizar el filtro `process_acf_image_fields()` en `functions.php` del proyecto **granrahback** para procesar esos campos específicos.

#### Critical ACF Handling

**ACF fields can be either an object or an empty array** when no fields exist. Always check:
```typescript
if (pageData.acf && !Array.isArray(pageData.acf)) {
  // Safe to access ACF properties
  const subtitle = pageData.acf.subtitle;
}
```

**Featured Images**: Can be `false`, `undefined`, or an object with sizes (thumbnail, medium, large, full). Always validate:
```typescript
if (featuredImages && typeof featuredImages === 'object' && 'large' in featuredImages) {
  const imageUrl = featuredImages.large.url;
}
```

**ACF Image Fields**: After processing by `functions.php`, ACF image fields are objects with multiple sizes:
```typescript
if (pageData.acf?.image && typeof pageData.acf.image === 'object' && 'full' in pageData.acf.image) {
  const imageUrl = pageData.acf.image.full.url;
}
```

### Helper Functions (`src/helpers/index.ts`)

- **`formatDate(dateStr)`**: ISO date → "lunes, 15 de enero de 2024" (Spanish locale)
- **`formatShortDate(dateStr)`**: ISO date → "15 de enero de 2024" (no weekday)
- **`stripHtml(htmlString)`**: Remove HTML tags from WordPress rendered content
- **`truncateWords(text, maxWords)`**: Truncate to N words with "..."
- **`getYear(dateStr)`**: Extract year from ISO date
- **`nullToEmptyString(arg)`**: Convert null/undefined to empty string

### Path Aliases

TypeScript is configured with `@/*` alias pointing to `src/*`:

```typescript
import { PostsSchema } from "@/types";
import { formatDate } from "@/helpers";
import Layout from "@/layouts/Layout.astro";
```

### Image Optimization

Astro's `<Picture>` component is used for WordPress images:

```astro
import { Picture } from "astro:assets";

<Picture
  src={featuredImage}
  alt={title}
  width={imageWidth}
  height={imageHeight}
  formats={["avif", "webp"]}
/>
```

WordPress domain is whitelisted in `astro.config.mjs`:
```javascript
image: {
  domains: ["granrahback.local"],
}
```

### Layout System

**`Layout.astro`**: Base layout with:
- Props: `title`, `subtitle`, `bgImage`
- Header with background image and subtitle
- Main content area (`<slot />`)
- Optional after-main-content slot
- Client-side routing enabled via `<ClientRouter />`

**Page Structure Example** (`src/pages/index.astro`):
```astro
---
import Layout from "@/layouts/Layout.astro";
import { HomePageSchema } from "@/types";

// Fetch WordPress page by slug (sin try-catch)
const url = `${import.meta.env.API_URL}/pages?slug=inicio`;
const response = await fetch(url);
const json = await response.json();

const parsedData = HomePageSchema.parse(json[0]);

const title = parsedData.title.rendered;

let subtitle = "";
if (parsedData.acf && !Array.isArray(parsedData.acf) && parsedData.acf.title) {
  subtitle = parsedData.acf.title;
}

let bgImage = "";
if (parsedData.acf && !Array.isArray(parsedData.acf) && parsedData.acf.image && typeof parsedData.acf.image === 'object' && 'full' in parsedData.acf.image) {
  bgImage = parsedData.acf.image.full.url;
}

if (!bgImage && parsedData.featured_images && typeof parsedData.featured_images === 'object' && 'full' in parsedData.featured_images) {
  bgImage = parsedData.featured_images.full.url;
}
---

<Layout title={title} subtitle={subtitle} bgImage={bgImage}>
  <!-- Page content -->
</Layout>
```

### Styling

TailwindCSS v4 integrated via Vite plugin in `astro.config.mjs`. Global styles in `src/styles/global.css` define custom CSS variables and utility classes:

- Custom colors: `accent-gold`, `primary-bg`, `secondary-bg`
- Custom button class: `.btn-gold`
- Font families: Bebas Neue (headings), Outfit (body)

## WordPress Backend Configuration

### WordPress Project: granrahback

El backend de WordPress vive en un proyecto separado llamado **granrahback** (Local by Flywheel).

**Ubicación del functions.php**:
```
/Users/titan-dev/Local Sites/granrahback/app/public/wp-content/themes/granrah_site/functions.php
```

### Modificaciones a la API de WordPress

**IMPORTANTE**: Cuando necesites modificar campos de la API REST de WordPress o procesar campos ACF, debes trabajar en el archivo `functions.php` del tema `granrah_site` dentro del proyecto **granrahback**.

Este archivo contiene:
- Registro de campos personalizados REST API: `register_rest_field()`
- Filtros para modificar respuestas de la API: `add_filter('rest_prepare_page', 'process_acf_image_fields')`
- Procesamiento de imágenes ACF (convierte IDs en objetos con URLs)
- Procesamiento de featured_images para todos los post types

### Procesamiento Automático de Imágenes ACF

WordPress convierte automáticamente los IDs de campos de imagen ACF en objetos completos mediante el filtro `process_acf_image_fields()` en `functions.php`.

**Transformación automática**:
```php
// Antes (ID numérico):
acf.image: 26

// Después (objeto procesado):
acf.image: {
  thumbnail: { url: "...", width: 150, height: 150 },
  medium: { url: "...", width: 300, height: 300 },
  medium_large: { url: "...", width: 768, height: 768 },
  large: { url: "...", width: 1024, height: 1024 },
  full: { url: "...", width: 2000, height: 2000 }
}
```

**Agregar procesamiento para nuevos campos ACF**:

Cuando creas una nueva página con un campo ACF de imagen personalizado (ej: `hero_image`, `gallery_images`), debes actualizar la función `process_acf_image_fields()` en `functions.php`:

```php
function process_acf_image_fields($response, $post, $request) {
    $data = $response->get_data();

    if (isset($data['acf']) && is_array($data['acf'])) {
        // Campo de imagen único existente
        if (isset($data['acf']['image']) && is_numeric($data['acf']['image'])) {
            $data['acf']['image'] = process_acf_image_field($data['acf']['image']);
        }

        // AGREGAR: Nuevo campo de imagen personalizado
        if (isset($data['acf']['hero_image']) && is_numeric($data['acf']['hero_image'])) {
            $data['acf']['hero_image'] = process_acf_image_field($data['acf']['hero_image']);
        }

        // AGREGAR: Nuevo campo de galería personalizado
        if (isset($data['acf']['gallery_images']) && is_array($data['acf']['gallery_images'])) {
            $processed_gallery = array();
            foreach ($data['acf']['gallery_images'] as $image_id) {
                if (is_numeric($image_id)) {
                    $image_data = process_acf_image_field($image_id);
                    if ($image_data) {
                        $processed_gallery[] = $image_data;
                    }
                }
            }
            $data['acf']['gallery_images'] = $processed_gallery;
        }
    }

    $response->set_data($data);
    return $response;
}
```

**Regla**: Cada vez que agregues un campo ACF de tipo **Image** o **Gallery** en WordPress, actualiza este filtro en `functions.php` para que se procese automáticamente.

### WordPress REST API Endpoints

Endpoints comunes utilizados:

```
GET /posts?_embed                              # All posts with embedded media/authors
GET /posts?per_page=1&_embed                   # Latest post only
GET /pages?slug=inicio                         # Page by slug
GET /albums                                    # Custom post type: albums
GET /events                                    # Custom post type: events
GET /products?categoria-producto={id}&_embed   # Products by category ID
GET /categoria-producto?slug={slug}            # Get category by slug (musica, ropa, etc.)
```

El parámetro `?_embed` incluye featured images y otros recursos embebidos.

### Campos ACF Requeridos para Productos

Para el **post type `products`** con categoría **"musica"**, necesitas configurar estos campos ACF en WordPress:

- `price` (Number) - Precio del producto en pesos
- `description` (WYSIWYG/Textarea) - Descripción HTML con lista de canciones
- `url_spotify` (URL) - URL embed de Spotify
- `url_youtube` (URL) - URL embed de YouTube
- `product_image` (Image) - Imagen del producto (opcional, puede usar featured_image)

**Ejemplo de valores**:
```json
{
  "price": 10990,
  "description": "<ol><li>Canción 1</li><li>Canción 2</li></ol>",
  "url_spotify": "https://open.spotify.com/embed/album/...",
  "url_youtube": "https://www.youtube.com/embed/videoseries?list=..."
}
```

## Key Components

**`Latest.astro`** (`src/components/ui/Latest.astro`):
- Fetches and displays the most recent WordPress post
- Handles missing featured images gracefully
- Uses `PostsSchema` for validation
- Applies `truncateWords` and `stripHtml` to excerpts

**`ProductsGrid.astro`** (`src/components/products/ProductsGrid.astro`):
- Muestra productos filtrados por categoría (musica, ropa, etc.)
- Recibe props: `categorySlug` (string) y `title` (string)
- Consulta la taxonomía `categoria-producto` para obtener productos
- Usa `ProductsMusicSchema` para validar productos de música
- Ejemplo de uso:
  ```astro
  <ProductsGrid categorySlug="musica" title="Discos Disponibles" />
  ```

**`ProductCard.astro`** (`src/components/products/ProductCard.astro`):
- Muestra un producto individual (disco de música) - LEGACY
- Incluye imagen, título, precio, descripción
- Enlaces a Spotify y YouTube
- Botón de WhatsApp para consultas de compra
- Formatea precio en pesos chilenos (CLP)

**`MusicAlbums.astro`** (`src/components/music/MusicAlbums.astro`) - **RECOMENDADO**:
- Componente principal para mostrar discografía en página de inicio
- Diseño elegante con animaciones CSS (fadeInUp con delay)
- Efectos hover avanzados: escala de imagen, overlay gradiente, botones flotantes
- Efecto de brillo que cruza la imagen en hover
- Lógica condicional según campo `for_sale`:
  - Si `for_sale = true`: Muestra badge "En Venta", precio, y botón WhatsApp
  - Si `for_sale = false`: Solo muestra imagen, título, y enlaces streaming
- Responsive: botones flotantes en desktop (hover), botones fijos en móvil
- Grid adaptable: 1 columna (móvil) → 4 columnas (desktop XL)
- Props: `title` (string), `showDescription` (boolean)
- Ejemplo de uso:
  ```astro
  <MusicAlbums title="Discografía" showDescription={false} />
  ```

## Important Notes

- **No git repo**: This directory is not currently a git repository
- **WordPress dependency**: Site requires WordPress backend running at configured API_URL
- **Static generation**: Astro builds static HTML at build time, fetching all WordPress data during build
- **Spanish locale**: All date formatting and content is in Spanish
- **Image domains**: When adding new WordPress domains, update `astro.config.mjs` image.domains array
