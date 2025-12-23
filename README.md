# 📝 Notes App - Aplicación de Notas con Notificaciones

Aplicación moderna de notas con notificaciones programables, construida con React, TypeScript y Vite. Diseño minimalista con persistencia en localStorage y sistema completo de recordatorios diarios.

## ✨ Características

- ✅ **Crear y eliminar notas** con interfaz intuitiva
- ✅ **Notificaciones programables** (9AM, 10AM, 11AM o sin notificación)
- ✅ **Persistencia de datos** con localStorage
- ✅ **Diseño accesible** (WCAG 2.1 AA)
- ✅ **Responsive** - Mobile-first design
- ✅ **Confirmación de eliminación** para prevenir errores
- ✅ **Toast notifications** para feedback visual
- ✅ **Docker ready** para despliegue en producción

## 🚀 Inicio Rápido

### Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Abrir en navegador
# http://localhost:5173
```

### Docker (Producción)

```bash
# Build de la imagen
docker build -t notes-app .

# Ejecutar contenedor
docker run -d -p 3000:80 notes-app

# O usar docker-compose
docker-compose up -d
```

Ver [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) para más detalles.

## 📦 Scripts Disponibles

```bash
npm run dev      # Desarrollo (Vite dev server)
npm run build    # Build para producción
npm run preview  # Preview del build
npm run lint     # Ejecutar ESLint
```

## 🏗️ Arquitectura

```
src/
├── components/           # Componentes React
│   ├── App.tsx          # Componente principal
│   ├── NoteCard.tsx     # Tarjeta de nota
│   ├── ConfirmModal.tsx # Modal de confirmación
│   └── Toast.tsx        # Notificación toast
├── hooks/               # Custom hooks
│   └── useLocalStorage.ts
├── services/            # Lógica de negocio
│   └── notifications.ts # Servicio de notificaciones
├── types/               # TypeScript types
│   └── index.ts
└── styles/              # CSS Modules
    ├── App.module.css
    ├── NoteCard.module.css
    ├── ConfirmModal.module.css
    └── Toast.module.css
```

## 📚 Documentación

- [**DESIGN_SYSTEM.md**](DESIGN_SYSTEM.md) - Sistema de diseño y guías de estilo
- [**STORAGE_SYSTEM.md**](STORAGE_SYSTEM.md) - Arquitectura de persistencia
- [**NOTIFICATIONS_SYSTEM.md**](NOTIFICATIONS_SYSTEM.md) - Sistema de notificaciones
- [**DOCKER_DEPLOYMENT.md**](DOCKER_DEPLOYMENT.md) - Guía de despliegue con Docker

## 🎨 Sistema de Diseño

- **Paleta de colores**: Indigo primary con neutros y semánticos
- **Tipografía**: System fonts (16px mínimo)
- **Accesibilidad**: WCAG 2.1 AA compliant
- **Contraste**: Ratios > 4.5:1 en todo el texto
- **Touch targets**: Mínimo 44x44px

## 🔔 Notificaciones

Las notificaciones utilizan la **Notifications API** del navegador:

1. Solicita permiso al usuario (primera vez)
2. Programa recordatorios diarios a la hora seleccionada
3. Se reprograman automáticamente cada día
4. Persisten después de recargar la página

**Nota**: En producción, las notificaciones requieren HTTPS.

## 🐳 Despliegue en Dockploy

### Opción 1: Desde Git Repository

1. Conecta tu repositorio en Dockploy
2. Selecciona "Dockerfile" como método de build
3. Puerto interno: `80`
4. Habilita SSL/HTTPS
5. Deploy 🚀

### Opción 2: Docker Compose

```bash
# Subir docker-compose.yml a tu servidor
docker-compose up -d
```

Ver documentación completa en [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)

## 🛠️ Stack Tecnológico

- **Frontend**: React 19 + TypeScript
- **Build**: Vite 7
- **Estilos**: CSS Modules
- **Persistencia**: localStorage API
- **Notificaciones**: Notifications API
- **Servidor**: Nginx (producción)
- **Container**: Docker + Alpine Linux

## 📊 Características Técnicas

### Performance
- ⚡ First Contentful Paint < 1.8s
- ⚡ Time to Interactive < 3.9s
- ⚡ Bundle size optimizado con Vite

### Seguridad
- 🔒 Security headers configurados
- 🔒 Usuario no-root en Docker
- 🔒 Sin dependencias con vulnerabilidades conocidas
- 🔒 XSS protection habilitado

### SEO y PWA Ready
- 📱 Responsive design
- 📱 Mobile-first approach
- 📱 Preparado para convertir en PWA

## 🧪 Testing

```bash
# Ejecutar linter
npm run lint

# Build de prueba
npm run build

# Preview del build
npm run preview
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la licencia MIT.

## 👨‍💻 Autor

Desarrollado siguiendo las mejores prácticas de UX/UI, accesibilidad y arquitectura de software moderna.

---

## 🔗 Enlaces Útiles

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Dockploy Documentation](https://dockploy.dev/docs)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**¿Preguntas?** Revisa la documentación en la carpeta raíz o abre un issue.
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
