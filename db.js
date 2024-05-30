const { DataSource } = require("typeorm");
const conection = new DataSource({
  type: "postgres",
  host: "dpg-cpbica7sc6pc73a9rl80-a.oregon-postgres.render.com",
  port: 5432,
  username: "admin",
  password: "IbOLF90ge6B9be0cjXxALZa9hXIyMzIk",
  database: "tiete_limpo",
  // entities: './task.js',
  synchronize: false,
  ssl: true
});

// function conect(){
//   conection.initialize().then(() => {
//       console.log("Funfooou")
//   }).catch((err) => {
//       console.log("Não funfooou ", err)
//   })
// }

// conect()

module.exports = conection;