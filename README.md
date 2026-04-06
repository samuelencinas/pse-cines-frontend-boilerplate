# Cines Frontend Boilerplate - PSE 2026

Este repositorio contiene un *boilerplate* o plantilla inicial para construir un **frontend** con el *stack* tecnológico final que utilizaremos en la asignatura. La plantilla contiene lo realizado a nivel *frontend* durante los **Laboratorios 1 - 5 de la asignatura**, es decir:

- Inicialización del frontend con **React** + **TypeScript**
- Implementación de la vista **Listado de Cines** con sus carteleras mediante **componentes funcionales** y widgets de Material UI
- Tipados y DTOs
- Por el momento **NO** incluye autenticación y autorización
- Implementación de un **tema de color** 
- **Todo el código comentado**

Expone dos rutas:

- `/` que muestra el *hola, mundo* por defecto de React + Vite
- `/cinemas` que hace la llamada a la API y en caso de éxito, renderiza el listado de cines

## Arquitectura

![Diagrama de arquitectura a (altísimo) nivel](architecture.png)

## Uso

1. Clonar el repositorio y `npm install` para instalar las dependencias
2. `npm run dev` para ejecutar el servidor