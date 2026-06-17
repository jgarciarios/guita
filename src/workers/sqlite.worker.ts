import init from '@sqlite.org/sqlite-wasm'

// Must install opfs-sahpool VFS before registering the Worker1 API handler,
// otherwise open() calls with ?vfs=opfs-sahpool will fail with "no such vfs".
const sqlite3 = await init()
await sqlite3.installOpfsSAHPoolVfs({})
sqlite3.initWorker1API()
