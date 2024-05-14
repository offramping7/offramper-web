import {createRecipient} from "@/lib/recipients"
import { NextResponse } from 'next/server';

export async function POST(req) {
    const { currency,bankName,nickname,phoneNumber,bankSpecificFieldValue } = await req.json();
    const {address,blokchain,cryptocurrency} = await createRecipient({currency,bankName,nickname,phoneNumber,bankSpecificFieldValue})
    return new NextResponse.json({address,blokchain,cryptocurrency})
  }
  
