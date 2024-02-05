import { Client } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import { env } from "@/env";
import * as schema from "./schema";

// export const db = drizzle(
//   new Client({
//     url: env.DATABASE_URL,
//   }).connection(),
//   { schema }
// );




import 'dotenv/config'
// import { drizzle } from 'drizzle-orm/planetscale-serverless'
import { connect } from '@planetscale/database'

// create the connection
const connection = connect({
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD
})

const db = drizzle(connection, { schema })