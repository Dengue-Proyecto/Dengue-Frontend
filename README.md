# Dengue Frontend 🦟📊

<div align="center">
  <img src="https://angular.io/assets/images/logos/angular/angular.svg" alt="Angular" width="60" height="60"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="TypeScript" width="60" height="60"/>
  <img src="https://www.chartjs.org/img/chartjs-logo.svg" alt="Chart.js" width="60" height="60"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg" alt="HTML5" width="60" height="60"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg" alt="CSS3" width="60" height="60"/>
  <img src="https://material.angular.io/assets/img/angular-material-logo.svg" alt="Angular Material" width="60" height="60"/>
</div>

<br>

Una aplicación web desarrollada en Angular para la evaluación de riesgo de dengue, análisis y gestión de datos relacionados con el dengue. El sistema proporciona herramientas avanzadas de visualización de datos, generación de reportes y análisis estadístico para apoyar la toma de decisiones en salud pública.

## 🎯 Características Principales

- **📋 Gestión de Información**: Sistema completo para el registro y seguimiento de casos
- **📄 Generación de Reportes**: Exportación de datos en formato PDF con jsPDF
- **📱 Responsive Design**: Adaptable a dispositivos móviles y desktop
- **🔍 Análisis Estadístico**: Herramientas para análisis de tendencias y patrones

## 🚀 Tecnologías

### Frontend Core
- **Angular 19.2.0** - Framework principal para SPA
- **TypeScript 5.7.2** - Lenguaje de programación tipado
- **Angular CLI 19.2.7** - Herramientas de desarrollo
- **RxJS 7.8.0** - Programación reactiva y manejo de observables

### UI/UX
- **Angular Material** - Componentes UI con tema Azure Blue
- **CSS3** - Estilos personalizados y responsive design
- **HTML5** - Estructura semántica moderna

### Visualización y Reportes
- **HTML2Canvas 1.4.1** - Captura de elementos DOM
- **HTML2PDF.js 0.10.3** - Conversión HTML a PDF
- **jsPDF 3.0.1** - Generación de documentos PDF
- **ngx-markdown 19.1.1** - Renderizado de contenido Markdown

### Testing
- **Jasmine 5.6.0** - Framework de testing
- **Karma 6.4.0** - Test runner
- **TypeScript 5.7.2** - Tipado estático para mejor testing

## 📋 Prerrequisitos

- **Node.js** (versión 18 o superior)
- **npm** o **yarn**
- **Angular CLI** 19.2.7 o superior

## 🛠️ Instalación

### Configuración del Entorno

```bash
# Clonar el repositorio
git clone https://github.com/Dengue-Proyecto/Dengue-Frontend.git

# Navegar al directorio del proyecto
cd Dengue-Frontend

# Instalar dependencias
npm install
```

### Ejecución en Desarrollo

```bash
# Ejecutar servidor de desarrollo
npm start
# o
ng serve

# La aplicación estará disponible en http://localhost:4200
```

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm test
# o
ng test

# Ejecutar tests con coverage
ng test --code-coverage

# Ejecutar tests en modo watch
ng test --watch
```

## 🎨 Personalización

### Angular Material Theme
```css
/* src/styles.css */
@import '@angular/material/prebuilt-themes/azure-blue.css';

.custom-theme {
  --primary-color: #2196f3;
  --accent-color: #ff4081;
  --warn-color: #f44336;
}
```

## 👥 Equipo de Desarrollo

- **Desarrollador**: [AngeloSanchez28](https://github.com/AngeloSanchez28)
- **Desarrollador**: [Mabeelu-LL](https://github.com/Mabeelu-LL)

## 🏥 Sobre el Proyecto

Este proyecto forma parte de una iniciativa para combatir el dengue mediante tecnicas de Machine Learning, proporcionando herramientas digitales para el monitoreo y análisis de datos epidemiológicos que apoyen las decisiones en salud pública.

<div align="center">
  <br><br>
  <i>Desarrollado con ❤️ por Angelo Sánchez y Mabel León</i>
</div>
