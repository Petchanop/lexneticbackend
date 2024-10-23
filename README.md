# lexneticbackend
for lexnetic backend test

## After clone the repository open project with vs code
    - create .env file in todo-backend folder
    - fill in the value provide by .env.local

    You have to install vscode extension Dev Containers
    Start running project with vscode devcontainer

    - ctrl + shift + p
    - choose reopen with container

## Trobleshoots if container not start
    - check if another container occupied port 5432 or 3000
    - check postgres logs if database container cannot start in case maybe postgres is different version

## Initialize project
open vscode terminal use cd command to go inside todo-backend directory

    cd todo-backend &&
    npm i

## Build project
    npm run build

## Start in development mode
    npm run start:dev

## Start in production mode
    npm run start

## Run All unit test
    npm run test

## Run specific test
    npm run {module folder name}

For test api using url localhost:3000/api which create by Swagger ui
** Now only have just user unit test to show
