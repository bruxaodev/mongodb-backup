import 'dotenv/config'
import { spawn } from 'child_process'
import { readFileSync, existsSync, mkdirSync, readdirSync, rmSync } from 'fs'
import { schedule } from 'node-cron'

const { TOTAL_BACKUPS, CRON_TIME } = process.env

async function handleDbs() {
    const dateStr = getDate()


    const dbs = JSON.parse(readFileSync('dbs.json', 'utf-8'))
    for (const db of dbs) {
        const pathName = `./data/${db.hostName}/${dateStr}`
        if (!existsSync(pathName)) {
            mkdirSync(pathName, { recursive: true })
        }

        for (const dbName of db.dbs) {
            await backupDb(dbName, db.uri, pathName)
        }

        deleteOldBackups(`./data/${db.hostName}`)
    }
    console.log('All backups done')
}

async function backupDb(dbName: string, uri: string, pathName: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const pathDb = `${pathName}/${dbName}.gzip`
        if (existsSync(pathDb)) return resolve(console.log(`db ${dbName} backup already exists`))

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

function deleteOldBackups(path: string): void {
    const files = readdirSync(path)
    if (files.length > Number(TOTAL_BACKUPS)) {
        files.sort((a, b) => {
            return new Date(a).getTime() - new Date(b).getTime()
        })
        const fileToDelete = files[0]
        console.log(`Deleting file ${fileToDelete}`)
        rmSync(`${path}/${fileToDelete}`, { recursive: true })
    }
}

function getDate(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    return `${day}-${month}-${year}`;
}

schedule(String(CRON_TIME), () => handleDbs())
handleDbs()