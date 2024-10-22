import { spawn } from 'child_process'
import { readFileSync, existsSync, mkdirSync } from 'fs'

async function handleDbs() {
    const pathDate = `./data/${getDate()}`
    if (!existsSync(pathDate)) {
        mkdirSync(pathDate)
    }

    const dbs = JSON.parse(readFileSync('dbs.json', 'utf-8'))
    for (const db of dbs) {
        for (const dbName of db.dbs) {
            await backupDb(dbName, db.uri, pathDate)
        }
    }
    console.log('All backups done')
}

async function backupDb(dbName: string, uri: string, pathDate: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const pathDb = `${pathDate}/${dbName}.gzip`
        if (existsSync(pathDb)) resolve(console.log(`db ${dbName} already exists`))

        const child = spawn('mongodump', [
            `--db=${dbName}`,
            `--uri=${uri}`,
            `--archive=${pathDb}`,
            '--gzip'
        ])

        child.stdout.on('data', (data) => console.log(data.toString()))
        child.stderr.on('data', (data) => console.error(data.toString()))
        child.on('exit', (code) => {
            if (code === 0) {
                resolve(console.log(`db ${dbName} - backup done`))
            } else {
                reject(new Error(`db ${dbName} - backup failed`))
            }
        })
    })
}

function getDate(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    return `${day}-${month}-${year}`;
}

handleDbs()