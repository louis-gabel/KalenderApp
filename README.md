# KalenderApp
A simple application for displaying and managing seminars, built with a Node.js REST API, a MariaDB database, and a React frontend.

## Prerequisites
Ensure the following software is installed:
- [Node.js](https://nodejs.org/) (version 14 or higher)
- [MariaDB](https://mariadb.org/) 
- [npm](https://www.npmjs.com/) (npm is a Package manager for the JavaScript runtime environment Node.js)

---

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
```
## How to setup a test database for developing the backend
### Setting Up a Test Database with Knex and MariaDB
#### Prerequisites
Ensure the following software is installed:
- [Node.js](https://nodejs.org/) (version 14 or higher)
- [MariaDB](https://mariadb.org/) 
- Knex: 
```bash 
npm install knex 
```
Adapt the passworts in the files to your locally db-root passwort:
- database_setup.js
- knexfile.js
Follow this steps to create a test database:
1. Create a test db with running the database_setup.js: 
```bash
node database_setup.js
```
2. Use Knex migrations to create the database tables:
```bash
npx knex migrate:latest --env development
```
3. Insert testdata with seeds:
```bash
npx knex seed:run --env development
```
### Starting the test REST-API
Go to package.json and start debugging or start debugging over VSC (launch.json needed, create file with help of VSC). 
