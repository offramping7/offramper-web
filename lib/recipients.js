//hook up to the database and then pul data
import clientPromise from "./db/mongodb";
const BLOCKCHAIN = "bsc";
import { cryptocurrencyFromBlockchain } from "@/utils/crypto"

export const createRecipient = async ({currency,bankName,nickname,phoneNumber,bankSpecificFieldValue}) => {
    const client = await clientPromise;
    const db = client.db("server");
    const blockchain = BLOCKCHAIN
    const address = "faux"+makeid(5)
    const cryptocurrency =
        cryptocurrencyFromBlockchain[blockchain][
      USE_NATIVE_COINS ? "coin" : "token"
    ];

    const definition = {currency,bankName,nickname,phoneNumber,bankSpecificFieldValue,address,blockchain,cryptocurrency}
    const insertedObject = await db
        .collection("binCodes")
        .insertOne(definition)
        console.log("inserted object:", insertedObject)
   
    return {address,blockchain,cryptocurrency}
}





function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }
  