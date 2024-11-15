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

1. Create a test db with running the database_setup.js: 
-  need to adapt passwort in database_setup.js to root passwort before running the code
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
