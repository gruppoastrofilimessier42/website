import { Firestore, getFirestore } from "firebase/firestore";
import { assert } from "ts-essentials";

let database: Database|null = null; 

class Database {
  private _db?: Firestore;

  public get db() {
    assert(this._db, 'You need to initialize the db first')
    return this._db
  }

  static async initialize() {
    const databaseInstance = new Database();
    databaseInstance._db = await getFirestore()
    return databaseInstance;
  }

}

export const getDatabase = async () => {
  if(!database){
    database = await Database.initialize()
  }
  
  return database.db;
}