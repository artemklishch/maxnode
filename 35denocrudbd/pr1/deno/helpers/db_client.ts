import { Bson, MongoClient, Database } from "https://deno.land/x/mongo@v0.22.0/mod.ts"
// import { MongoClient } from "https://deno.land/x/mongo@v0.22.0/mod.ts"

let db: Database;
// let db;

export async function connect() {
    const client = new MongoClient();
    await client.connect("mongodb+srv://Artem:LjFTMaaDvBKci4uf@cluster0.mmwrn.mongodb.net/?retryWrites=true&w=majority");
    db = client.database("denotodos");
}

export function getDb() {
    return db;
}