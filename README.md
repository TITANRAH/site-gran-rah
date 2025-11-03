# Site Gran Rah - Sitio Oficial

Sitio web oficial del artista de hip-hop **Gran Rah**, construido con Astro 5 y TailwindCSS v4, conectado a un backend de WordPress.

## Stack Tecnológico

- **Frontend**: Astro 5.14.1
- **Estilos**: TailwindCSS 4.1.14
- **Backend**: WordPress REST API v2
- **Validación**: Zod (integrado con Astro)
- **Lenguaje**: TypeScript

## Inicio Rápido

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia el archivo de ejemplo y edita las URLs de tu WordPress:

```bash
cp .env.example .env.development
```

Edita [.env.development](.env.development):

```env
API_URL=http://granrahback.local/wp-json/wp/v2
HOME_URL=http://granrahback.local/
```

### 3. Iniciar servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:4321](http://localhost:4321) en tu navegador.

## Comandos Disponibles

| Comando              | Acción                                           |
| :------------------- | :----------------------------------------------- |
| `npm install`        | Instala las dependencias                         |
| `npm run dev`        | Inicia el servidor de desarrollo en `localhost:4321` |
| `npm run build`      | Construye el sitio para producción en `./dist/`  |
| `npm run preview`    | Previsualiza el build de producción localmente   |

## Documentación

- **[claude.md](claude.md)** - Documentación completa del proyecto para Claude AI
- **[WORDPRESS_SETUP.md](WORDPRESS_SETUP.md)** - Guía de configuración de WordPress
- **[EJEMPLO_NOTICIAS.md](EJEMPLO_NOTICIAS.md)** - Ejemplo completo de integración con posts

## Estructura del Proyecto

```
site-gran-rah-fixed/
├── src/
│   ├── components/      # Componentes Astro reutilizables
│   ├── helpers/         # Funciones auxiliares (formateo, etc.)
│   ├── layouts/         # Layouts de página
│   ├── pages/           # Rutas del sitio
│   ├── types/           # Schemas Zod para WordPress API
│   └── styles/          # Estilos globales
├── public/              # Archivos estáticos
├── .env.development     # Variables de entorno (NO incluir en git)
└── astro.config.mjs     # Configuración de Astro
```

## Integración con WordPress

### Endpoints Principales

```typescript
// Obtener todos los posts
const posts = await fetch(`${import.meta.env.API_URL}/posts?_embed`);

// Obtener una página por slug
const page = await fetch(`${import.meta.env.API_URL}/pages?slug=sobre-mi`);

// Custom post types (álbumes, eventos)
const albums = await fetch(`${import.meta.env.API_URL}/albums`);
```

### Validación con Zod

Todos los datos de WordPress se validan con schemas Zod:

```typescript
import { PostsSchema } from "@/types";

const response = await fetch(url);
const json = await response.json();
const posts = PostsSchema.parse(json); // ✅ Validado y tipado
```

### Helpers Disponibles

```typescript
import { formatDate, stripHtml, truncateWords } from "@/helpers";

formatDate("2024-01-15");           // "lunes, 15 de enero de 2024"
stripHtml("<p>Hola</p>");           // "Hola"
truncateWords("Texto largo...", 10); // "Texto largo..."
```

## Características

- ✅ **Integración completa con WordPress** - REST API + validación Zod
- ✅ **Última noticia dinámica** - Componente Latest.astro conectado a WordPress
- ✅ **Optimización de imágenes** - Astro Image + WordPress featured images
- ✅ **TypeScript** - Tipos seguros con schemas Zod
- ✅ **TailwindCSS v4** - Estilos modernos y responsivos
- ✅ **SSG por defecto** - Generación estática para máximo rendimiento

## Próximos Pasos

1. Configura tu backend de WordPress siguiendo [WORDPRESS_SETUP.md](WORDPRESS_SETUP.md)
2. Crea contenido en WordPress (posts, páginas, álbumes)
3. Implementa páginas adicionales usando [EJEMPLO_NOTICIAS.md](EJEMPLO_NOTICIAS.md) como referencia
4. Personaliza estilos en [src/styles/global.css](src/styles/global.css)

## Recursos

- [Astro Documentation](https://docs.astro.build)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)
- [TailwindCSS](https://tailwindcss.com)
- [Zod](https://zod.dev)

## Soporte

Para más información, consulta [claude.md](claude.md) con la documentación completa del proyecto.
