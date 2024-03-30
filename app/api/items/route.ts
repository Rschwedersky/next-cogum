import { firestore } from "../../../firebase/server";
import { NextRequest, NextResponse } from "next/server";

export enum ItemAccess{
    PUBLIC="PUBLIC",
    USER="USER",
    PRO= "PRO",
    ADMIN= "ADMIN",
}
export type Item={
    id:string;
    title:string;
    access: ItemAccess;
}
/* const defaulItems:Item[]= [{id:"item-1",title:"i am a public item", access:ItemAccess.PUBLIC},
{id:"item-2",title:"i am a user item", access:ItemAccess.USER},
{id:"item-3",title:"i am a pro item", access:ItemAccess.PRO},
{id:"item-1",title:"i am a Admin item", access:ItemAccess.ADMIN}] */

export async function GET(request:NextRequest) { 
    try{
        if(!firestore)
            return new NextResponse("internal Error",{status:500});

        const response =await firestore.collection("items").get();
        const items = response.docs.map((doc)=>doc.data());

        return NextResponse.json(items);
    }
    catch(error){
            return new NextResponse("internal Error",{status:500});
        }
    }