# Configuración de Docker para Despliegue en Dockploy

## 🐳 Arquitectura Docker

Esta aplicación utiliza un **multi-stage build** para optimizar el tamaño de la imagen final y mejorar la seguridad.

### Etapas del Build

1. **Builder Stage (node:20-alpine)**
   - Instala dependencias de desarrollo
   - Compila la aplicación con Vite
   - Genera bundle optimizado en `/dist`

2. **Production Stage (nginx:1.25-alpine)**
   - Imagen ligera de nginx
   - Solo contiene archivos estáticos compilados
   - Configuración de nginx optimizada
   - Usuario no-root para seguridad

---

## 📦 Archivos de Configuración

### Dockerfile
Multi-stage build optimizado que reduce la imagen de ~1GB a ~25MB

**Características:**
- ✅ Node 20 Alpine para build (mínimo tamaño)
- ✅ Nginx Alpine para producción
- ✅ Usuario no-root (seguridad)
- ✅ Health check incluido
- ✅ Cache de dependencias optimizado

### nginx.conf
Configuración de servidor web para SPA

**Características:**
- ✅ Compresión gzip habilitada
- ✅ Cache de assets estáticos (1 año)
- ✅ SPA routing (todas las rutas → index.html)
- ✅ Security headers (XSS, clickjacking, etc.)
- ✅ Error handling customizado

### .dockerignore
Excluye archivos innecesarios del contexto de build

**Excluye:**
- node_modules (se reinstalan en build)
- Archivos de configuración local
- Documentación (excepto README)
- Git y CI/CD configs

### docker-compose.yml
Orquestación local y configuración para Dockploy

**Incluye:**
- Port mapping (3000:80)
- Health checks
- Restart policy
- Networking
- Watchtower labels

---

## 🚀 Despliegue en Dockploy

### Opción 1: Desde Repositorio Git

Dockploy puede construir automáticamente desde tu repositorio:

1. **Conecta tu repositorio** en Dockploy
2. **Selecciona Dockerfile** como método de build
3. **Configura el puerto**: `80` (interno)
4. **Puerto público**: El que Dockploy asigne o configures
5. **Deploy** 🚀

### Opción 2: Build Local y Push a Registry

```bash
# Build de la imagen
docker build -t notes-app:latest .

# Tag para tu registry
docker tag notes-app:latest your-registry.com/notes-app:latest

# Push al registry
docker push your-registry.com/notes-app:latest
```

Luego en Dockploy:
- Selecciona "Docker Image"
- Especifica `your-registry.com/notes-app:latest`
- Deploy

### Opción 3: Docker Compose (Recomendado para desarrollo local)

```bash
# Iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

Acceder en: `http://localhost:3000`

---

## ⚙️ Variables de Entorno

Actualmente la app es estática (frontend only), pero puedes agregar variables en el futuro:

```yaml
# En docker-compose.yml o Dockploy
environment:
  - VITE_API_URL=https://api.example.com
  - VITE_ENV=production
```

**Nota:** Variables VITE_ deben definirse en **build time**, no runtime.

---

## 🔧 Comandos Útiles

### Build Local

```bash
# Build de la imagen
docker build -t notes-app .

# Build sin cache (forzar rebuild)
docker build --no-cache -t notes-app .

# Build con argumentos
docker build --build-arg NODE_VERSION=20 -t notes-app .
```

### Run Local

```bash
# Ejecutar contenedor
docker run -d -p 3000:80 --name notes-app notes-app

# Ver logs
docker logs -f notes-app

# Detener y eliminar
docker stop notes-app && docker rm notes-app
```

### Inspección

```bash
# Ver tamaño de imagen
docker images notes-app

# Inspeccionar capas
docker history notes-app

# Ejecutar shell en contenedor
docker exec -it notes-app sh

# Ver health status
docker inspect --format='{{.State.Health.Status}}' notes-app
```

---

## 📊 Métricas de la Imagen

### Tamaños Esperados

| Etapa | Tamaño Aproximado |
|-------|-------------------|
| Builder (node:20-alpine) | ~200MB |
| Build artifacts (dist) | ~500KB - 2MB |
| **Final (nginx:alpine)** | **~25MB** |

### Optimizaciones Aplicadas

1. **Multi-stage build**: Descarta dependencias de desarrollo
2. **Alpine Linux**: Base minimalista (~5MB)
3. **npm ci**: Instalación determinista y más rápida
4. **Gzip en nginx**: Reduce tamaño de transferencia 70%
5. **Cache de dependencias**: Acelera rebuilds

---

## 🔐 Seguridad

### Medidas Implementadas

✅ **Usuario no-root**: Contenedor corre como `nodejs:1001`  
✅ **Imagen Alpine**: Menor superficie de ataque  
✅ **Security Headers**: XSS, clickjacking, MIME sniffing  
✅ **No secretos en imagen**: Use variables de entorno  
✅ **Health checks**: Detección de contenedor no saludable  

### Recomendaciones Adicionales

- [ ] Escanear imagen con Trivy o Snyk
- [ ] Usar image signing con Cosign
- [ ] Implementar límites de recursos (CPU/RAM)
- [ ] Monitoreo con Prometheus/Grafana

---

## 🌐 Networking

### Puertos

| Puerto Interno | Puerto Externo | Servicio |
|----------------|----------------|----------|
| 80 | 3000 (configurable) | Nginx HTTP |

### Reverse Proxy (Producción)

Para HTTPS y dominio personalizado, configura Dockploy con:

- **Domain**: `notes.tudominio.com`
- **SSL**: Auto (Let's Encrypt)
- **Redirect HTTP → HTTPS**: Habilitado

---

## 🔄 CI/CD con Dockploy

### Webhook para Auto-Deploy

Dockploy puede reconstruir automáticamente al hacer push:

1. Habilita webhook en Dockploy
2. Agrega webhook URL a GitHub/GitLab
3. Push a `main` → auto-deploy 🚀

### Workflow Example (GitHub Actions)

```yaml
name: Deploy to Dockploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Trigger Dockploy Webhook
        run: |
          curl -X POST ${{ secrets.DOCKPLOY_WEBHOOK_URL }}
```

---

## 🧪 Testing del Contenedor

### Health Check

```bash
# Ver estado de health
docker inspect notes-app | grep -A 10 Health

# Forzar health check
docker exec notes-app wget -q -O - http://localhost/
```

### Performance

```bash
# Ver uso de recursos
docker stats notes-app

# Ver procesos
docker top notes-app
```

### Logs

```bash
# Logs en tiempo real
docker logs -f notes-app

# Últimas 100 líneas
docker logs --tail 100 notes-app

# Con timestamps
docker logs -t notes-app
```

---

## 📈 Escalabilidad

### Horizontal Scaling con Dockploy

1. **Load Balancer**: Dockploy maneja automáticamente
2. **Múltiples replicas**: Configura en settings
3. **Health checks**: Asegura que solo replicas saludables reciban tráfico

### Consideraciones

- App es **stateless** (todo en localStorage del cliente)
- Sin base de datos backend (por ahora)
- Fácil escalar horizontalmente
- Session stickiness no necesario

---

## 🐛 Troubleshooting

### Problema: Imagen muy grande

**Solución:**
```bash
# Verificar .dockerignore incluye node_modules
# Usar npm ci en lugar de npm install
# Asegurar multi-stage build
```

### Problema: App no carga

**Solución:**
```bash
# Verificar nginx.conf está copiado
# Verificar rutas en Dockerfile
# Revisar logs: docker logs notes-app
```

### Problema: SPA routing no funciona

**Solución:**
```nginx
# Asegurar en nginx.conf:
location / {
    try_files $uri $uri/ /index.html;
}
```

### Problema: Notificaciones no funcionan

**Nota:** Las notificaciones del navegador requieren HTTPS en producción.
Asegúrate de que Dockploy tenga SSL habilitado.

---

## 📚 Referencias

- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Dockploy Documentation](https://dockploy.dev/docs)
- [Docker Security](https://docs.docker.com/engine/security/)

---

## 🎯 Checklist de Despliegue

Antes de desplegar en producción:

- [ ] Dockerfile probado localmente
- [ ] Build exitoso sin errores
- [ ] Health check funciona
- [ ] Tamaño de imagen < 50MB
- [ ] Security headers configurados
- [ ] SSL/HTTPS habilitado en Dockploy
- [ ] Domain apuntando correctamente
- [ ] Backup de configuración
- [ ] Monitoreo configurado

---

*Sistema dockerizado listo para producción con Dockploy* 🚀
