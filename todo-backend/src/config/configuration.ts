import { User } from "../users/entities/users.entity";
import { Comment } from "../comments/entities/comments.entity"
import { Task } from "src/tasks/entities/tasks.entity";
import { DataSource } from "typeorm";

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432
  }
});

//db configuration
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.POSTGRES_USER,
  password: `${process.env.POSTGRES_PASSWORD}`,
  entities: [User, Task, Comment],
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
})

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!")
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err)
  })