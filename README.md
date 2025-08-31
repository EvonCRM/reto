# Reto técnico — Base de código

Este repositorio contiene la base de código que utilizarás para completar tu reto técnico.

Importante:

- Úsalo exclusivamente para el reto y según las indicaciones compartidas.
- El reto solo puede aparecer como un fork de este repositorio en tu cuenta de GitHub.
- No compartas credenciales ni información sensible en el fork.

## Objetivo

- Implementar las funcionalidades solicitadas por el evaluador sobre esta base.
- Entregar una solución funcional, limpia y mantenible.
- Documentar decisiones, supuestos y cómo ejecutar tu solución.

## Requisitos previos

- Node.js 18+ (o la versión indicada por el evaluador).
- npm (o el gestor de paquetes que defina el evaluador).
- Docker (opcional, si prefieres levantar Postgres con contenedor).

## Configuración del entorno

1. Descomprimir el proyecto y entrar al directorio:

```bash
cd reto
```

2. Instalar dependencias:

```bash
npm install
```

3. Crear el archivo de variables de entorno:

```bash
cp .env.example .env
```

## Servicios

### Base de datos

Puedes usar Docker o una instalación local de PostgreSQL.

#### Opción A: Docker

```bash
docker compose up -d
```

#### Opción B: Instalar PostgreSQL

1. Instalar PostgreSQL (Homebrew/Chocolatey o desde el sitio oficial).

```bash
brew install postgresql
```

2. Crear el usuario inicial:

```bash
sudo -u postgres psql
CREATE USER postgres WITH PASSWORD 'password';
ALTER USER postgres WITH SUPERUSER;
\q
```

3. Configurar `.env` con tus credenciales:

```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/formbuilder?schema=public
```

4. Aplicar migraciones (si procede para tu reto):

```bash
npx prisma migrate dev
```

Nota: Si ves el error “User 'postgres' was denied access on the database 'formbuilder.public'”, es un problema conocido de configuración entre Prisma y PostgreSQL. Como alternativa temporal:

- La app puede funcionar parcialmente sin migraciones.
- Funciones de autenticación pueden fallar hasta ajustar permisos.
- Verifica que el usuario postgres tenga permisos adecuados.

### Integraciones opcionales

Solo configúralas si tu reto las requiere.

#### Stripe (opcional)

1. Activa modo test y crea producto/precio.
2. Copia las credenciales en `.env`:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
PRO_PRODUCT_ID=
PRO_PRODUCT_PRICE_ID=
```

#### Proveedor SMTP (opcional)

Soporta NodeMailer (SMTP) y Resend.

```bash
EMAIL_SENDER=
EMAIL_MAILER=NodeMailer # NodeMailer (default) | Resend

# NodeMailer
EMAIL_SERVER_HOST=
EMAIL_SERVER_PORT=
EMAIL_SERVER_USER=
EMAIL_SERVER_PASS=

# Resend
EMAIL_RESEND_API_KEY=
```

Para Gmail, usa contraseña de aplicación:

```bash
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=465
EMAIL_SERVER_USER=example@gmail.com
EMAIL_SERVER_PASS=suyz yeba qtgv xrnp
```

Notas de desarrollo:

- Si no configuras un proveedor de email, los códigos OTP y los enlaces de restablecimiento se mostrarán en la consola del servidor cuando ejecutes `npm run dev`.
- Si no configuras Stripe (campos STRIPE_SECRET_KEY vacíos), la aplicación funcionará correctamente creando IDs temporales de cliente para el desarrollo local.
- **Problema conocido**: Actualmente existe un problema de permisos con PostgreSQL en Docker que impide que Prisma acceda correctamente a la base de datos. La aplicación puede ejecutarse parcialmente sin las migraciones aplicadas.

## Base de Datos

### Prisma

Este proyecto utiliza Prisma como cliente de base de datos. Prisma es un ORM agnóstico que puede utilizarse con varios motores de base de datos, incluyendo Postgres, MySQL, e incluso motores NoSQL como MongoDB.

Aunque se recomienda Postgres, la elección de la base de datos queda a tu criterio.

### PostgreSQL

Para comenzar, necesitas instalar PostgreSQL. Si ya lo tienes instalado o has elegido otro conector de base de datos, puedes omitir esta sección.

#### Windows

1. Visita la [página de descarga de PostgreSQL](https://www.postgresql.org/download/windows/).
2. Descarga e instala Postgres.
3. Alternativamente, usa [Chocolatey](https://chocolatey.org/) (como Homebrew para Windows).

#### macOS

Si usas Mac, el método de instalación recomendado es Homebrew:

```bash
brew install postgresql
```

#### Usuario Inicial

En Windows, usualmente se crea un usuario inicial automáticamente. Sin embargo, en macOS y Linux, necesitas crearlo manualmente. Primero, inicia sesión en Postgres como superusuario:

```bash
sudo -u postgres psql
```

Luego, crea el usuario inicial:

```bash
CREATE USER postgres WITH PASSWORD 'password';
ALTER USER postgres WITH SUPERUSER;
```

Sal del prompt de Postgres con:

```bash
\q
```

#### Cadena de Conexión

Reemplaza la cadena de conexión en el archivo `.env` con tus credenciales de Postgres. Las credenciales predeterminadas (usuario/contraseña) son `postgres` y `password`.

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/formbuilder?schema=public
```

#### Migraciones

Primero asegúrate de que las dependencias están instaladas:

```bash
npm install
```

Para crear la base de datos y aplicar los archivos de migración, ejecuta el siguiente comando:

```bash
npx prisma migrate dev
```

**Nota**: Si encuentras errores de permisos con Docker, puedes usar:

```bash
npx prisma db push --accept-data-loss
```

#### Prisma Studio

Prisma Studio es una herramienta útil para ver y gestionar datos en tu base de datos local. Sirve como una alternativa ligera a herramientas como pgAdmin o DBeaver.

Visita [Prisma Studio](https://www.prisma.io/studio) para más información.

#### Modelos Principales

Los modelos más importantes son:

- Account
- Contact  
- Invitation
- Organization
- Session
- User

#### Relaciones de Modelos

- Organization -> Users
- Organization -> Contacts
- Organization -> Invitations
- User -> Sessions
- User -> Accounts

El modelo Contact es un ejemplo de un agregado con muchos modelos dependientes, ilustrando un escenario del mundo real. En un contexto de e-commerce, esto podría renombrarse a Customer o algo similar.

#### Multitenencia

La multitenencia se implementa separando datos en la misma base de datos usando un `organizationId`, también conocido comúnmente como `tenantId`.

El `organizationId` está en el objeto de sesión:

```typescript
const session = await auth();
session.user.organizationId;
```

#### Cómo usar Prisma

Esta guía cubre operaciones básicas del cliente de base de datos, incluyendo consultar, crear, actualizar y eliminar registros. Para más detalles sobre el cliente Prisma, consulta la [documentación oficial de Prisma](https://www.prisma.io/docs/).

**Bueno saber**: Siempre usa datos no obtenibles por el usuario como `session.user.organizationId` para proporcionar prueba de propiedad del objeto.

##### Consultar Registros

Para recuperar registros de la base de datos, usa el método `findMany` en el cliente Prisma:

```typescript
import { prisma } from '@/lib/db/prisma';

const contacts = await prisma.contact.findMany({
  where: { organizationId: session.user.organizationId },
  orderBy: { createdAt: 'desc' }
});
```

##### Crear Registros

Para crear un nuevo registro en la base de datos, usa el método `create`:

```typescript
import { prisma } from '@/lib/db/prisma';

const contact = await prisma.contact.create({
  data: {
    organizationId: session.user.organizationId,
    name: 'John Doe',
    email: 'john.doe@gmail.com'
  }
});
```

##### Actualizar Registros

Para actualizar un registro existente, usa el método `update`:

```typescript
import { prisma } from '@/lib/db/prisma';

const updatedContact = await prisma.contact.update({
  where: {
    organizationId: session.user.organizationId,
    id: parsedInput.contactId
  },
  data: {
    name: 'John Travolta'
  }
});
```

##### Eliminar Registros

Para eliminar un registro de la base de datos, usa el método `delete`:

```typescript
import { prisma } from '@/lib/db/prisma';

const deletedContact = await prisma.contact.delete({
  where: {
    organizationId: session.user.organizationId,
    id: parsedInput.contactId
  }
});
```

## Ejecución

1. Iniciar la aplicación:

```bash
npm run dev
```

2. Abrir en el navegador:

- http://localhost:3000

## Entregables

Incluye en tu entrega:

- Instrucciones para ejecutar tu solución (si difieren de este README).
- Descripción de las funcionalidades implementadas.
- Decisiones técnicas y supuestos.
- Áreas de mejora pendientes y cómo las abordarías.
- Pruebas (si aplica) y cómo ejecutarlas.
- Cualquier script adicional útil.

Forma de entrega:

- Realiza un fork de este repositorio en tu cuenta de GitHub y trabaja allí.
- Puedes usar branch/PR dentro de tu fork o enviar un archivo patch, según indique el evaluador.
- Evita crear repositorios nuevos; todo el trabajo debe permanecer en tu fork.

## Criterios de evaluación

- Funcionalidad: requisitos cubiertos y comportamiento esperado.
- Calidad de código: legibilidad, estructura, tipado, linting.
- UX/UI: claridad, consistencia, accesibilidad básica.
- Robustez: manejo de errores y estados.
- Pruebas: cobertura y foco en partes críticas (si aplica).
- Git: commits claros, mensajes útiles, historia limpia.
- Performance: uso razonable de recursos, buenas prácticas.

## Buenas prácticas y restricciones

- No crees repositorios nuevos ni copies el código fuera del fork.
- Mantén el trabajo únicamente en el fork de tu cuenta de GitHub.
- No expongas credenciales en commits.
- Documenta claramente cualquier limitación o decisión de alcance.

¡Éxitos con el reto!
