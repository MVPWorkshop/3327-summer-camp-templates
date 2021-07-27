# Support Children Backend
Node.js backend template for 2nd Challenge of 3327 Summer Camp

# Requirements
- On your computer
    * Installed [yarn](https://yarnpkg.com/) package manager
    * Installed [PostgreSQL](https://www.postgresql.org/)

# Installation guide

Once you have cloned the repo on your computer you
can start configuring the backend application by
following next steps:

1. Navigate to the root of the project
2. Run `yarn` to install dependencies
3. Setup the postgres database: `createdb <your_database_name>`
4. In the root of the project, create `.env` file
5. Fill the `.env` file, example of the values can
   be copied from the `.env.example` file (NOTE: All values should be filled)
6. Build the project
    - Windows: `yarn windows:build`
    - Mac/Linux: `yarn build`
7. Run migrations
    - Windows: `yarn windows:migrate`
    - Mac/Linux: `yarn migrate`
8. Run seeders
    - Windows: `yarn windows:seed`
    - Mac/Linux: `yarn seed`
9. After everything has been completed, to run the
   app, use the `yarn dev` command for dev environment 
   or `yarn start` for production build
