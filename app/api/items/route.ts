import { Item, ItemAccess } from "@/app/types/items";
import { auth, firestore } from "@/firebase/server";
import { DecodedIdToken } from "firebase-admin/auth";
import { NextRequest, NextResponse } from "next/server";


export const dynamic = 'force-dynamic'; // Prevent static generation

const defaultItems: Item[] = [
  { id: "item-1", title: "I am a public item", access: ItemAccess.PUBLIC },
  { id: "item-2", title: "I am a public item", access: ItemAccess.PUBLIC },
  { id: "item-3", title: "I am a user item", access: ItemAccess.USER },
  { id: "item-4", title: "I am a user item", access: ItemAccess.USER },
  { id: "item-5", title: "I am a pro item", access: ItemAccess.PRO },
  { id: "item-6", title: "I am a pro item", access: ItemAccess.PRO },
  { id: "item-7", title: "I am an admin item", access: ItemAccess.ADMIN },
];

export async function GET(request: NextRequest) {
  try {
    if (!firestore) {
      console.error("Firestore not initialized");
      return NextResponse.json({ error: "Internal Error: No Firestore" }, { status: 500 });
    }
    if (!auth) {
      console.error("Auth not initialized");
      return NextResponse.json({ error: "Internal Error: No Auth" }, { status: 500 });
    }

    const authToken = request.headers.get("authorization")?.split("Bearer ")[1] || null;
    let user: DecodedIdToken | null = null;
    if (authToken) {
      try {
        user = await auth.verifyIdToken(authToken);
      } catch (error) {
        console.error("Auth token verification error:", error);
      }
    }

    let userInfo = null;
    if (user) {
      if (!process.env.API_URL) {
        console.error("API_URL is not defined");
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
      }
      const userInfoResponse = await fetch(
        `${process.env.API_URL}/api/users/${user.uid}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (userInfoResponse.ok) {
        userInfo = await userInfoResponse.json();
      } else {
        console.error("Failed to fetch user info:", userInfoResponse.status);
      }
    }

    const isPro = userInfo?.isPro || false;
    const isAdmin = user?.admin || false;

    const firestoreCall = isAdmin
      ? firestore.collection("items").get()
      : user && isPro
      ? firestore.collection("items").where("access", "in", [ItemAccess.PUBLIC, ItemAccess.USER, ItemAccess.PRO]).get()
      : user
      ? firestore.collection("items").where("access", "in", [ItemAccess.PUBLIC, ItemAccess.USER]).get()
      : firestore.collection("items").where("access", "==", ItemAccess.PUBLIC).get();

    const response = await firestoreCall;
    let items = response.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Item));

    if (items.length === 0) {
      const batch = firestore.batch();
      defaultItems.forEach((item) => {
        const itemRef = firestore.collection("items").doc(item.id);
        batch.set(itemRef, item);
      });
      await batch.commit();
      items = defaultItems;
    }

    return NextResponse.json(items);
  } catch (error) {
    console.error("API error in /api/items:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}