# lexneticbackend
for lexnetic backend test

##After clone the repository open project with vs code and run:
    - ctrl + shift + p
    - select reopen with container

    trobleshoots if container not start
    - check if another container occupied port 5432 or 3000
    - check postgres logs if database container cannot start in case maybe postgres is different version

##Initialize project
    - open vscode terminal use cd command to go inside todo-backend directory
    - run npm i

##Build project
    - npm run build

##Start in development mode
    - npm run start:dev

##Start in production mode
    - npm run start

For test api using url localhost:3000/api which create by Swagger ui
