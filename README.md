# Zendra - Chat AI para Shopify

Zendra es una aplicación de Shopify que integra un chatbot con inteligencia artificial directamente en tu tienda. Permite a los clientes hacer consultas en tiempo real a través de un chat embebido en la web mediante una extensión.

## Características Principales

- Chatbot con IA integrado en la tienda
- Interfaz de usuario intuitiva y moderna
- Respuestas en tiempo real
- Personalización del diseño del chat
- Fácil integración con cualquier tienda Shopify

## Requisitos Previos

Antes de comenzar, necesitarás:

1. **Node.js**: [Descargar e instalar](https://nodejs.org/en/download/) si aún no lo tienes.
2. **Cuenta de Shopify Partner**: [Crear una cuenta](https://partners.shopify.com/signup) si no tienes una.
3. **Tienda de Prueba**: Configurar una [tienda de desarrollo](https://help.shopify.com/en/partners/dashboard/development-stores#create-a-development-store) para probar la aplicación.

## Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/matiasdiaz21/zendra.git
cd zendra
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crear un archivo `.env` con las siguientes variables:

```env
SHOPIFY_API_KEY=tu_api_key
SHOPIFY_API_SECRET=tu_api_secret
SCOPES=read_products,write_products
HOST=tu_host
```

### 4. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

### 5. Desplegar la Aplicación

```bash
npm run deploy
```

## Guía del Desarrollador

### Estructura del Proyecto

```
zendra/
├── app/                    # Código principal de la aplicación
│   ├── routes/            # Rutas de la aplicación
│   ├── shopify.server.js  # Configuración de Shopify
│   └── ...
├── extensions/            # Extensiones de Shopify
│   └── zendra-bot/       # Extensión del chatbot
│       ├── assets/       # Recursos estáticos
│       └── blocks/       # Bloques de Liquid
├── prisma/               # Configuración de la base de datos
└── public/              # Archivos públicos
```

### Componentes Principales

1. **Chatbot UI (`extensions/zendra-bot/assets/chatbot.js`)**
   - Maneja la interfaz del usuario del chat
   - Gestiona la comunicación con el backend
   - Procesa las respuestas de la IA

2. **Backend (`app/routes/`)**
   - `app._index.jsx`: Página principal de la aplicación
   - `app.additional.jsx`: Configuraciones adicionales
   - `webhooks.app.*.jsx`: Manejo de webhooks

3. **Base de Datos (`prisma/`)**
   - Almacena configuraciones y datos de sesión
   - Utiliza Prisma como ORM

### Flujo de Trabajo

1. **Desarrollo Local**
   ```bash
   npm run dev
   ```

2. **Pruebas**
   - Usar la tienda de desarrollo para probar la integración
   - Verificar el funcionamiento del chatbot
   - Probar diferentes escenarios de uso

3. **Despliegue**
   ```bash
   npm run build
   npm run deploy
   ```

### Personalización

#### Estilos del Chatbot
Los estilos del chatbot se pueden personalizar en:
- `extensions/zendra-bot/assets/chatbot.css`

#### Configuración de la IA
La configuración de la IA se maneja en:
- `app/routes/app._index.jsx`

### Solución de Problemas

1. **El chatbot no aparece**
   - Verificar que la extensión esté instalada
   - Comprobar los permisos de la aplicación
   - Revisar la consola del navegador para errores

2. **Problemas de autenticación**
   - Verificar las variables de entorno
   - Asegurarse de que los scopes sean correctos
   - Revisar los logs del servidor

3. **Errores de base de datos**
   - Ejecutar migraciones de Prisma
   - Verificar la conexión a la base de datos
   - Revisar los logs de Prisma

## Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
