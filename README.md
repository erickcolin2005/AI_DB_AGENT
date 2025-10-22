# 🤖 AI_DB_AGENT — Agente Inteligente de Consultas sobre Bases de Datos

**Autor:** Erick Collin Albornoz Hernández  
**Repositorio:** [https://github.com/erickcolin2005/AI_DB_AGENT](https://github.com/erickcolin2005/AI_DB_AGENT)  
**Correo:** ercoalhe2@gmail.com  

---

## 🧠 Descripción del Proyecto

**AI_DB_AGENT** es una **aplicación web** que combina inteligencia artificial con bases de datos relacionales para automatizar consultas SQL.  
El usuario escribe preguntas en lenguaje natural (por ejemplo:  
> “Dame los 5 productos más vendidos en agosto y compáralos con julio”)  
y el sistema interpreta, genera la sentencia SQL, la ejecuta en **PostgreSQL** y devuelve los resultados junto con análisis automáticos de tendencias.

Esta herramienta está diseñada para analistas, desarrolladores y equipos técnicos que deseen obtener información de manera rápida sin escribir SQL manualmente.

---

## ⚙️ Arquitectura del Sistema

La arquitectura está basada en **contenedores Docker** que integran:

┌───────────────────────────────┐
│ Interfaz Web │
│ (Next.js / React Frontend) │
└───────────────────────────────┘
│
▼
┌───────────────────────────────┐
│ Backend Inteligente │
│ (FastAPI + Prisma ORM + AI) │
│ - Interpreta lenguaje natural │
│ - Genera SQL dinámico │
│ - Ejecuta consultas en DB │
└───────────────────────────────┘
│
▼
┌───────────────────────────────┐
│ PostgreSQL DB │
│ - Datos empresariales │
│ - Consultas analíticas │
└───────────────────────────────┘


---

## 🧩 Tecnologías Utilizadas

| Componente | Tecnología |
|-------------|-------------|
| Frontend | **Next.js 14 (React + TypeScript)** |
| Backend | **FastAPI + Prisma ORM** |
| Base de Datos | **PostgreSQL 16** |
| Contenedores | **Docker y Docker Compose** |
| Lenguajes | **TypeScript, Python, SQL** |
| Orquestación | **docker-compose.yml** |
| Control de Versiones | **Git + GitHub** |

---

## 📁 Estructura del Proyecto

AI_DB_AGENT/
│
├── prisma/
│ └── schema.prisma # Esquema de la base de datos
│
├── src/
│ ├── pages/ # Interfaz web (Next.js)
│ ├── lib/ # Lógica de conexión e IA
│ ├── components/ # Componentes visuales reutilizables
│ └── utils/ # Funciones auxiliares
│
├── docker-compose.yml # Orquestación de contenedores
├── Dockerfile # Imagen principal del agente
├── .env.example # Variables de entorno base
└── README.md # Documentación del proyecto


---

## 🚀 Despliegue Local

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/erickcolin2005/AI_DB_AGENT.git
cd AI_DB_AGENT

### 2️⃣ Crear archivo .env

DATABASE_URL="postgresql://postgres:postgres@db:5432/salesdb"
AI_API_KEY="tu_clave_de_openai_o_ia_sdk"

### 3️⃣ Levantar los contenedores
docker-compose up --build


Esto iniciará:

PostgreSQL en el puerto 5432

Aplicación web en http://localhost:3000

### 4️⃣ Ejecutar migraciones (si aplica)
npx prisma migrate deploy

💬 Ejemplo de Uso

Abre http://localhost:3000

Escribe una consulta en lenguaje natural:

Muéstrame los productos más vendidos en agosto.


El sistema genera y ejecuta el SQL:

SELECT product_name, SUM(quantity) AS total_vendido
FROM sales
WHERE EXTRACT(MONTH FROM fecha) = 8
GROUP BY product_name
ORDER BY total_vendido DESC
LIMIT 5;


La respuesta mostrará los resultados en tabla y un breve resumen de insights.