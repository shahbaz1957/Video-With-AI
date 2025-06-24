import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!
    // value of ! is here  => “Trust me, it’s not null or undefined.”

if(!MONGODB_URI){
      throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose

if(!cached){
   cached =  global.mongoose = {conn: null, promise:null}
}

export async function dbConnect(){

    // already connect
    if(cached.conn) return cached.conn;

    // promise on the way
    if(!cached.promise){
        const options = {
            bufferCommands : true,
            maxPoolSize: 10,
        }
      mongoose
        .connect(MONGODB_URI , options)
        .then(() => mongoose.connection)
    }
    try {
        cached.conn = await cached.promise
    } catch (error) {
        cached.promise = null
        throw error
    }
    return cached.conn
}