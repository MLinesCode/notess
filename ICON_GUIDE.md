# Guía Rápida: Generar Iconos PWA

## 🎨 Necesitas Crear

Los siguientes iconos deben estar en `/public/`:

- `icon-192.png` (192x192px) - Android home screen
- `icon-512.png` (512x512px) - Android splash screen

---

## 🛠️ Opción 1: Generador Online (Recomendado)

### PWA Builder Image Generator
https://www.pwabuilder.com/imageGenerator

1. Sube tu logo (PNG o SVG de alta resolución)
2. Ajusta padding y background
3. Genera todos los tamaños
4. Descarga el ZIP
5. Copia `icon-192.png` e `icon-512.png` a `/public/`

---

## 🛠️ Opción 2: Favicon Generator
https://realfavicongenerator.net/

1. Sube tu imagen
2. Ajusta opciones iOS/Android
3. Genera
4. Descarga y extrae los iconos necesarios

---

## 🛠️ Opción 3: Crear Manualmente

### Con Photoshop/GIMP:

1. Crea un archivo 512x512px
2. Fondo del color de tu marca o transparente
3. Coloca tu logo centrado
4. Exporta como PNG
5. Redimensiona a 192x192px para el icono pequeño

### Recomendaciones:
- **Formato:** PNG-24 con transparencia
- **Padding:** Deja ~10% de margen alrededor del logo
- **Background:** Usa el color de tu `theme_color` (#6366F1)
- **Simplificado:** En iconos pequeños, usa versión simplificada del logo

---

## 🖼️ Icono Temporal (Para Testing)

Si necesitas probar rápido, puedes usar el logo de Vite que ya existe:

```bash
# Copia el logo de Vite como placeholder
cp public/vite.svg public/icon.svg
```

Luego usa un convertidor online para convertir SVG → PNG en los tamaños necesarios.

---

## ✅ Verificar Iconos

Después de agregar los iconos:

1. **Build:** `npm run build`
2. **Preview:** `npm run preview`
3. **DevTools:** F12 → Application → Manifest
4. **Verificar:** Que los iconos aparezcan correctamente

---

## 📱 Testear en Dispositivo

### iOS:
1. Agregar a pantalla de inicio
2. Verificar que el icono se vea bien
3. El icono debe tener buen contraste

### Android:
1. Chrome → Menú → "Instalar aplicación"
2. Verificar icono en drawer
3. Verificar splash screen

---

## 🎨 Especificaciones Técnicas

### icon-192.png
- **Resolución:** 192x192px
- **Formato:** PNG-24
- **Uso:** App icon en Android, marcador iOS
- **Visible:** En drawer de apps, favoritos

### icon-512.png
- **Resolución:** 512x512px
- **Formato:** PNG-24
- **Uso:** Splash screen, Play Store listing
- **Visible:** Al iniciar PWA, screenshots

---

## 💡 Consejos de Diseño

### Para Mejor Visibilidad:
- ✅ Usa colores contrastantes
- ✅ Logo simple y reconocible
- ✅ Sin textos pequeños (ilegibles en 192px)
- ✅ Funciona en fondos claros y oscuros

### Errores Comunes:
- ❌ Logo muy complejo/detallado
- ❌ Texto muy pequeño
- ❌ Sin padding (logo toca bordes)
- ❌ Colores que no destacan

---

## 🚀 Deploy

Una vez tengas los iconos:

```bash
# Verificar que existen
ls public/icon-*.png

# Build y deploy
npm run build

# Los iconos se copiarán automáticamente a dist/
```

---

¡Listo! Ahora tu PWA tendrá iconos profesionales.
