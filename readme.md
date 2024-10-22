# Project Setup and Usage Guide
## Installation
- Install the necessary dependencies:

    ```sh
    npm install
    ```
- Copy the example database configuration file:

    ```sh
    cp dbs.example.json ./dbs.json
    ```
- Edit the .env file to configure the schedule time and number of backups.
Modify ./dbs.json to specify the databases and their settings.

- Build the project:

    ```sh
    npm run build
    ```
## Running the Application
### Start the Application
To start the application, use:

```sh
npm run app
```
### Running the Application (Development Mode)
For running the app in development mode, use:

```sh
npm run start
```
### Restoring a GZIP Backup
To restore a MongoDB database from a .gzip backup file, use the following command:

```sh
.\mongorestore.exe --db databaseName --uri "mongodb://username:password@localhost:27017/?directConnection=true&authSource=admin" --archive=.\databaseName.gzip --gzip
```
Make sure to replace:

databaseName with the actual name of your database,
username and password with your MongoDB credentials.
Running with Docker
To run the project with Docker, use:

```sh
docker compose up
```
This command will start up the application and any related services defined in the docker-compose.yml file.

