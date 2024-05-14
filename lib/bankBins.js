//hook up to the database and then pul data
import clientPromise from "./db/mongodb";

export const fetchBankBinsByCurrency = async ({currency}) => {
    const client = await clientPromise;
    const db = client.db("server");
    const objects = await db
        .collection("binCodes")
        .find({currencyCode:currency}).limit(100).toArray()
        
    const results = objects.map((obj)=>{
        return {
            binNumber:obj.binNumber,
            bankName:obj.bankName
        }
    })
   
    return results
}