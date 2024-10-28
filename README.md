
# Project Documentation

## Server Installation and API Setup

This document outlines the steps to install and set up the server for the API, including the necessary environment configuration.

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/) (Node package manager)
- [TypeScript](https://www.typescriptlang.org/) (if you are using TypeScript)

### 1. Clone the Repository

Start by cloning the repository to your local machine:

```bash
git clone https://github.com/Jamkyle/csv-upload-server.git
cd server
```

### 2. Install Dependencies

Install the necessary packages using npm:

```bash
npm install
```

### 3. TypeScript Configuration

Ensure you have a `tsconfig.json` file in your project root. Here is an example configuration:

```json
{
    "compilerOptions": {
        "baseUrl": "./src",
        "paths": {
            "@/*": ["*"]
        },
        "outDir": "./dist",
        "moduleResolution": "node",
        "target": "ES6",
        "module": "commonjs",
        "strict": true,
        "esModuleInterop": true
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "dist"]
}
```

### 4. Environment Variables

Create a `.env.local` file in the root of your project. This file will store your environment variables, such as database connection strings or API keys. Here's an example:

```env
# .env.local
PORT=3000
ALLOWED_ORIGINS=http://localhost:5178,http://other.com
```

**Note:** Be sure to add `.env.local` to your `.gitignore` file to prevent sensitive information from being pushed to version control.

### 5. Run the Server

To start the server in development mode, you can use `ts-node-dev` for automatic reloading:

```bash
npm run build
npm run dev
```

This command will compile the TypeScript files and start the server on the specified port.

### 6. API Endpoint

The key API endpoint available:

- **POST api/upload**: Upload a CSV file for processing.
  - Request Body: Form-data containing the file.
  - Response: A zipped file containing the processed CSV files.

### 7. Testing the API

You can use tools like [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) to test your API endpoint. Make sure to set the appropriate headers for file uploads.

### Conclusion

By following these steps, you should have your server set up and running with the necessary environment configuration. For further assistance, please refer to the documentation or raise an issue in the repository.
