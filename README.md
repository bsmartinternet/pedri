# Pedri — Deploy en VPS JOHAN (CyberPanel + Docker)

Herramientas internas de contenido con IA.
Stack: Node.js · Express · Docker · OpenLiteSpeed (reverse proxy) · CyberPanel (SSL)

---

## Arquitectura en JOHAN

```
Internet
  └─ CyberPanel / OpenLiteSpeed (80/443, SSL Let's Encrypt gestionado por CyberPanel)
       └─ Reverse Proxy → http://127.0.0.1:3001
            └─ Docker container "pedri"
                 └─ Node.js Express (puerto 3001, solo localhost)
                      ├─ /auth        → login / logout
                      ├─ /api/ai      → proxy seguro a Anthropic API
                      └─ /api/wordpress → publicacion WordPress REST API
```

La API key de Anthropic NUNCA sale del contenedor. El frontend llama a /api/* en el propio servidor.

---

## Estructura del proyecto

```
/opt/pedri/
├── Dockerfile
├── docker-compose.yml
├── env.example              <- plantilla; copia como .env
├── package.json
├── server.js                <- Express app
├── middleware/
│   └── auth.js              <- proteccion de rutas por sesion
├── routes/
│   ├── auth.js              <- login / logout / /me
│   └── api.js               <- proxy Anthropic + WordPress publisher
├── public/                  <- frontend estatico (protegido por auth)
│   ├── login.html
│   ├── index.html           <- dashboard
│   ├── css/
│   │   ├── app.css
│   │   └── newsletter.css
│   ├── js/
│   │   ├── app.js           <- utilidades globales
│   │   └── newsletter.js    <- logica herramienta newsletter
│   └── tools/
│       └── newsletter.html
└── logs/                    <- montado como volumen Docker
```

---

## Deploy paso a paso en JOHAN

### 1. Crear directorio y subir el proyecto

```bash
mkdir -p /opt/pedri
cd /opt/pedri

# Opcion A — desde tu maquina local via scp:
# scp -r ./pedri/ root@IP_JOHAN:/opt/pedri/

# Opcion B — git clone si tienes repo:
# git clone git@github.com:TU_USUARIO/pedri.git /opt/pedri
```

### 2. Configurar variables de entorno

```bash
cd /opt/pedri
cp env.example .env
nano .env
```

Rellena obligatoriamente:
- SESSION_SECRET  →  openssl rand -hex 32
- APP_USER        →  tu nombre de usuario
- APP_PASSWORD    →  password segura
- ANTHROPIC_API_KEY → tu clave de Anthropic

```bash
chmod 600 .env
```

### 3. Construir y arrancar el contenedor

```bash
cd /opt/pedri

# Primera vez — construye la imagen y arranca
docker compose up -d --build

# Verifica que esta corriendo
docker compose ps
docker compose logs -f pedri
```

Comprueba que responde:
```bash
curl http://127.0.0.1:3001/health
# Debe devolver: {"status":"ok","app":"pedri",...}
```

### 4. Configurar reverse proxy en CyberPanel

En CyberPanel → Websites → Tu dominio/subdominio → Rewrite Rules
O via OpenLiteSpeed Admin (puerto 7080):

Ve a: Virtual Hosts → pedri.tudominio.com → Context

Añade un Proxy Context:
```
URI:              /
Type:             Proxy
Web Server:       http://127.0.0.1:3001
```

O si prefieres editar el vhost directamente:
```
# En el fichero de configuracion del vhost de OLS
context / {
  type                    proxy
  handler                 http://127.0.0.1:3001
  addDefaultCharset       off
}

extprocessor pedri {
  type                    proxy
  address                 http://127.0.0.1:3001
  maxConns                100
  initTimeout             60
  retryTimeout            0
  respBuffer              0
}
```

### 5. SSL en CyberPanel

CyberPanel gestiona SSL automaticamente con Let's Encrypt.

En CyberPanel → SSL → Issue SSL para pedri.tudominio.com

No necesitas hacer nada mas. CyberPanel renueva automaticamente.

### 6. Verificar acceso

Abre https://pedri.tudominio.com
Debes ver la pantalla de login de Pedri.

---

## Comandos Docker utiles

```bash
# Ver estado
docker compose ps

# Logs en tiempo real
docker compose logs -f pedri

# Reiniciar (despues de cambios en .env)
docker compose restart pedri

# Reconstruir imagen (despues de cambios en el codigo)
docker compose up -d --build

# Detener
docker compose stop pedri

# Detener y eliminar contenedor (no borra imagenes ni volumenes)
docker compose down

# Ver uso de recursos
docker stats pedri

# Entrar al contenedor (debug)
docker exec -it pedri sh

# Ver logs del healthcheck
docker inspect --format='{{json .State.Health}}' pedri | python3 -m json.tool
```

---

## Actualizar el codigo

```bash
cd /opt/pedri

# 1. Actualiza el codigo (git pull o scp)
git pull

# 2. Reconstruye y reinicia sin downtime
docker compose up -d --build

# Docker reconstruye la imagen y reemplaza el contenedor automaticamente
```

---

## Anadir una nueva herramienta

1. Crea public/tools/mi-herramienta.html
2. Crea public/css/mi-herramienta.css
3. Crea public/js/mi-herramienta.js
4. Si necesita backend, añade en routes/api.js:
   router.use('/mi-herramienta', require('./mi-herramienta'));
5. Añade el enlace en el sidebar de index.html y newsletter.html
6. Reconstruye: docker compose up -d --build

---

## Checklist de seguridad (adaptado a CyberPanel + Docker)

### Docker
- [x] Puerto 3001 ligado a 127.0.0.1 unicamente (no expuesto publicamente)
- [x] Contenedor corre como usuario no-root (uid 1001)
- [x] no-new-privileges activado en docker-compose
- [x] Memoria limitada a 256MB
- [x] /tmp en tmpfs (en memoria)
- [x] Healthcheck configurado
- [ ] Configura log rotation de Docker: /etc/docker/daemon.json
      {"log-driver":"json-file","log-opts":{"max-size":"10m","max-file":"3"}}

### Aplicacion
- [x] API key de Anthropic solo en .env, jamas en frontend
- [x] Sesion httpOnly, firmada con SESSION_SECRET aleatorio
- [x] Cabeceras de seguridad en todas las respuestas
- [x] Validacion de variables de entorno al arranque
- [x] Endpoint /health sin autenticacion (solo para healthcheck interno)
- [ ] Cambia APP_PASSWORD por algo largo y aleatorio
- [ ] Rota SESSION_SECRET periodicamente (requiere reinicio del contenedor)

### VPS JOHAN
- [ ] Firewall UFW: solo 22, 80, 443 abiertos al exterior
      ufw allow 22 && ufw allow 80 && ufw allow 443 && ufw enable
- [ ] Puerto 3001 NO accesible desde exterior (solo 127.0.0.1)
      Verifica: ss -tlnp | grep 3001  →  debe mostrar 127.0.0.1:3001
- [ ] .env con permisos 600: chmod 600 /opt/pedri/.env
- [ ] .env nunca en Git (.gitignore lo excluye)
- [ ] CyberPanel actualizado a la ultima version
- [ ] Acceso SSH solo con clave, no con password

### SSL
- [x] SSL gestionado por CyberPanel / Let's Encrypt (renovacion automatica)
- [x] HTTPS terminado en OpenLiteSpeed antes de llegar al contenedor
- [ ] Verifica cabeceras HSTS en OLS: add_header Strict-Transport-Security

---

## Troubleshooting

### El contenedor no arranca
```bash
docker compose logs pedri
# Busca el error. Normalmente es una variable de entorno faltante.
```

### OLS devuelve 502 / 503
```bash
# Verifica que el contenedor esta corriendo y responde
docker compose ps
curl http://127.0.0.1:3001/health
```

### Login no funciona
```bash
# Verifica las variables en .env
grep APP_ /opt/pedri/.env
# Reinicia tras cambiar .env
docker compose restart pedri
```

### WordPress rechaza publicacion
- Verifica que la Application Password no tiene espacios al inicio/fin
- El usuario WP debe tener rol Editor o superior
- Usa el boton "Probar conexion" en la UI de Pedri antes de publicar
