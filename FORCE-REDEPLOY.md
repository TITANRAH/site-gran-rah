# Forzar Redeploy y Limpiar Caché de Vercel

## Problema
Aunque configuramos headers `no-cache`, Vercel cachea en su CDN edge y los cambios no se ven inmediatamente.

## Soluciones

### Opción 1: Redeploy desde Dashboard (MÁS FÁCIL)
1. Ve a https://vercel.com/dashboard
2. Selecciona tu proyecto
3. Ve a "Deployments"
4. Haz clic en el último deployment
5. Haz clic en ⋯ (tres puntos) → **"Redeploy"**
6. Espera 1-2 minutos
7. Refresca tu sitio (Cmd+Shift+R)

### Opción 2: Redeploy con Git (RÁPIDO)
```bash
cd /Users/titan-dev/Desktop/Proyectos/Astro/site-gran-rah-fixed

# Crear un commit vacío para forzar redeploy
git commit --allow-empty -m "Force redeploy to clear Vercel cache"
git push
```

### Opción 3: Redeploy con Vercel CLI
```bash
cd /Users/titan-dev/Desktop/Proyectos/Astro/site-gran-rah-fixed

# Login a Vercel (solo primera vez)
vercel login

# Forzar redeploy a producción
vercel --prod
```

### Opción 4: Agregar Query String (TEMPORAL)
Si necesitas ver los cambios AHORA sin esperar:
- En lugar de visitar: `https://granrah.vercel.app/tienda`
- Visita: `https://granrah.vercel.app/tienda?v=1`

Cambia el número cada vez que quieras ver cambios frescos.

## ¿Por qué pasa esto?

Vercel usa un **CDN edge global** que cachea las respuestas en múltiples ubicaciones. Aunque enviamos headers `no-cache`, el CDN puede tener una copia cacheada que tarda en expirar.

## Solución Permanente

Para que los cambios se vean más rápido en el futuro, ya configuramos:
- ✅ Headers anti-caché en todas las páginas de productos
- ✅ Sin prerender en páginas dinámicas
- ✅ Fetch directo a WordPress en cada request

Pero **siempre habrá un pequeño delay** (segundos a minutos) debido al CDN de Vercel.

## Alternativa: Invalidar Caché con Vercel API

Si esto se vuelve muy frecuente, puedes crear un webhook en WordPress que invalide el caché de Vercel automáticamente cuando publicas/eliminas productos.

Documentación: https://vercel.com/docs/rest-api/endpoints/deployments#create-a-new-deployment
