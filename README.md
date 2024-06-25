---

# Dreampos Panel Web Project

This is an admin dashboard project named Dreampos Panel, created using React, Redux, and TypeScript. The project is inspired by the Dreampos template available at [Dreamspos](https://dreamspos.io/) and uses Google Firebase for the backend.

## Pages Included

- **Login**: Allows admins to log in.
- **Register**: admins can sign up by entering their name, email, and password.
- **Home**: Provides an overview of the inventory, including the number of users and products along with their addition dates, displayed using charts.
- **Products**: Displays all products added to the site with detailed information. Admins can also edit or delete products.
- **Add Product**: Admins can add new products.
- **Users**: Displays registered users in a table format. Admins can also edit or delete users.
- **Add User**: Admins can add new users.
- **My Profile**: Admins can update their information (such as name, email, password, and profile picture).

## Additional Features

- Admins  must log in or register to access the Home, Products, Add Product, Users, Add User, and My Profile pages.

## Deployment

This project is deployed and can be accessed at [Dreampos Panel Web Project](https://dreampos.vercel.app/).

## Development Setup

To run the project locally:

1. Clone the repository.
2. Navigate to the project directory in your terminal.
3. Install dependencies using:
```bash
npm install
```
4. Start the development server:
```bash
npm run dev
```
To build the project for production, use:
```bash
npm run build
```

## Dependencies

- **Main Dependencies**:
  - @reduxjs/toolkit: ^2.1.0
  - chart.js: ^4.4.2
  - date-fns-jalali: ^3.6.0-0
  - firebase: ^10.10.0
  - react: ^18.2.0
  - react-chartjs-2: ^5.2.0
  - react-dom: ^18.2.0
  - react-icons: ^5.0.1
  - react-redux: ^9.1.0
  - react-router-dom: ^6.21.3
  
- **Development Dependencies**:
  - @types/react: ^18.2.43
  - @types/react-dom: ^18.2.17
  - @typescript-eslint/eslint-plugin: ^6.14.0
  - @typescript-eslint/parser: ^6.14.0
  - @vitejs/plugin-react: ^4.2.1
  - autoprefixer: ^10.4.17
  - eslint: ^8.55.0
  - eslint-plugin-react-hooks: ^4.6.0
  - eslint-plugin-react-refresh: ^0.4.5
  - postcss: ^8.4.33
  - tailwindcss: ^3.4.1
  - typescript: ^5.2.2
  - vite: ^5.0.8

For detailed package versions, refer to `package.json`.

---
