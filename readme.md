# Setup

```sh
npm install
```
```sh
cp dbs.exemple.json ./dbs.json
```

edit `./dbs.json`

```sh
npm run build
```


## Build & Run
```sh
npm run start
```

## RUN
```sh
npm run app
```

# RESTORE GZIP BACKUP

```sh
.\mongorestore.exe --db databaseName --uri "mongodb://username:password@localhost:27017/?directConnection=true&authSource=admin" --archive=.\databaseName.gzip --gzip
```