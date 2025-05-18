# Webcup The End Page Final

## Technologies Used
This project utilizes the following technologies:
- **Frontend:**
  - TypeScript (v4.x)
  - JavaScript (v ES6+)
  - CSS (for styling)
  - Webpack (as module bundler)
- **Backend:**
  - PHP (v8.x)
  - Symfony (v6.x)

## Libraries and Dependencies
Here are the main dependencies used in the project:
- **Frontend Dependencies** (defined in `package.json`):
  - Various Node modules
- **Backend Dependencies** (defined in `composer.json`):
  - Symfony components

## Steps to Run the Project
### Frontend Setup
1. Install dependencies:  
   ```bash
   npm install
2. Build the frontend assets::  
   ```bash
   npm run build
3. Start the frontend development server:
   ```bash
   npm run dev

### Backend Setup
1. Download and install Composer:
    ```bash
   curl -sS https://getcomposer.org/installer | php

2 - Install PHP dependencies:
        ```bash
   composer install

3. Create database:
   ```bash
   php bin/console doctrine:database:create

4. Run migrations:
   ```bash
   php bin/console doctrine:migrations:migrate

5. Start the Symfony development server:
   ```bash
   symfony serve:start
