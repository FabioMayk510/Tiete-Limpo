// const { Pool } = require('pg');

// const pool = new Pool({
//     type: 'postgres',
//     user: 'admin',
//     host: 'dpg-cpbica7sc6pc73a9rl80-a.oregon-postgres.render.com',
//     database: 'tiete_limpo',
//     password: 'IbOLF90ge6B9be0cjXxALZa9hXIyMzIk',
//     synchronize: false,
//     port: 5432
// });

// module.exports = pool;


const { DataSource } = require("typeorm");
const conection = new DataSource({
    type: 'postgres',
    host: "dpg-cpbica7sc6pc73a9rl80-a.oregon-postgres.render.com",
    port: 5432,
    username: 'admin',
    password: 'IbOLF90ge6B9be0cjXxALZa9hXIyMzIk',
    database: 'tiete_limpo',
    synchronize: false
})

module.exports = conection;