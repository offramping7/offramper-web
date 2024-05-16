import {createRecipient} from "@/lib/recipients"
// import { NextResponse } from 'next/server';

export async function POST(req) {
    const { currency,bankName,nickname,phoneNumber,bankSpecificFieldValue } = await req.json();
    const {address,blockchain,cryptocurrency} = await createRecipient({currency,bankName,nickname,phoneNumber,bankSpecificFieldValue})
    return Response.json({address,blockchain,cryptocurrency})
  }
  
