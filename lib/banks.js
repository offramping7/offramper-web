//hook up to the database and then pul data
import clientPromise from "./db/mongodb";

export const fetchBankNamesByCurrency = async ({currency}) => {
    const client = await clientPromise;
    const db = client.db("server");
    const objects = await db
        .collection("banks")
        .find({currency}).limit(100).toArray()
        
    const results = objects.map((obj)=>obj.bankName)
   
    return results
}