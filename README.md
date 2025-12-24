# School ERP System - Frontend (Angular)

Angular 18 frontend application for the School ERP System, built with Skote Admin Template.

## 🚀 Project Overview

This is the frontend application for a comprehensive School ERP System with three user roles:
- **Admin**: Complete system management
- **Teacher**: Class and student management
- **Student**: Academic information access

## 📋 Technology Stack

- **Angular**: 18.2.11
- **Bootstrap**: 5.3.3
- **Skote Admin Template**: Responsive dashboard template
- **RxJS**: Reactive programming
- **NgRx**: State management
- **Chart Libraries**: ApexCharts, Chart.js, ECharts

## 🛠️ Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Angular CLI

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Start development server:
```bash
ng serve
# or
npm start
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## 📁 Project Structure

```
src/app/
├── admin/          # Admin role modules
├── teacher/         # Teacher role modules
├── student/         # Student role modules
├── core/            # Core services, guards, interceptors
├── shared/          # Shared components and utilities
├── layouts/         # Layout components
└── account/         # Authentication modules
```

## 🔐 Authentication

The application uses JWT-based authentication with role-based access control (RBAC).

## 🏗️ Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

For production build:
```bash
ng build --configuration production
# or
npm run build-prod
```

## 🧪 Testing

Run unit tests:
```bash
ng test
```

Run end-to-end tests:
```bash
ng e2e
```

## 📚 Documentation

- [Requirements Document](./SCHOOL_ERP_REQUIREMENTS.md)
- [Implementation Guide](./IMPLEMENTATION_GUIDE.md)

## 🔗 Backend

The backend is built with Go Lang. See the backend repository for API documentation.

## 📝 License

This project is part of the School ERP System.

## 🤝 Contributing

This is a private project. For questions or issues, please contact the development team.
