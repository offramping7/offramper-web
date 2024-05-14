//hook up to the database and then pul data
import clientPromise from "./db/mongodb";

export const fetchPayoutOptionTypeDataByKey = async ({payoutOptionTypeKey}) => {
    const client = await clientPromise;
    const db = client.db("server");
    const myData = await db
        .collection("payoutOptionTypes")
        .findOne({payoutOptionTypeKey})
        
   
    return myData
}

export const fetchAvailablePayoutOptionTypesByCurrency = async ({currency}) => {
    const client = await clientPromise;
    const db = client.db("server");
    const allPayoutOptionTypes = await db
        .collection("payoutOptionTypes")
        .find()
        .limit(100)
        .toArray();
        
    const filtered = allPayoutOptionTypes.filter((data)=> {
        if (currency === 'RUB') {
            return true
        } else {
            if (data.payoutOptionTypeKey === 'card') {
                return true
            } else {
                return false;
            }
        }
    
    })
    // console.log("Inside server fetchAvailablePayoutOptionTypesByCurrency output is:", filtered)
    return filtered
}