//hook up to the database and then pul data
import clientPromise from "./db/mongodb";
const BLOCKCHAIN = "bsc";
import { cryptocurrencyFromBlockchain } from "@/utils/crypto"
const USE_NATIVE_COINS = true
export const createRecipient = async ({currency,bankName,nickname,phoneNumber,bankSpecificFieldValue}) => {
    const client = await clientPromise;
    const db = client.db("server");
    const blockchain = BLOCKCHAIN
    const address = "faux"+makeid(5)
    const cryptocurrency =
        cryptocurrencyFromBlockchain[blockchain][
      USE_NATIVE_COINS ? "coin" : "token"
    ];

    const definition = {currency,bankName,nickname,phoneNumber,bankSpecificFieldValue,address,blockchain,cryptocurrency, createdAt:new Date()}
    await db
        .collection("recipients")
        .insertOne(definition)
      console.log("inserted object:", {address})
   
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
  