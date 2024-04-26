import { auth, firestore } from "@/firebase/server";
import { DecodedIdToken } from "firebase-admin/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        if (!firestore)
            return new NextResponse("Internal Error", { status: 500 });

        const authToken =
            request.headers.get("authorization")?.split("Bearer ")[1] || null;

        let user: DecodedIdToken | null = null;
        if (auth && authToken)
            try {
                user = await auth.verifyIdToken(authToken);
            } catch (error) {
                // One possible error is the token being expired, return forbidden
                console.log(error);
            }

        const isAdmin = user?.admin;

        // Only admin or user can delete user info
        const valid = isAdmin || user?.uid === params.userId;
        if (!valid) return new NextResponse("Unauthorized", { status: 401 });

        const userDocument = await firestore.collection("users").doc(params.userId).get();
        if (!userDocument.exists) {
        return new NextResponse("Not Found", { status: 404 });
        }

        const userData = userDocument.data();
        console.log("userData",userData, params.userId)

        return NextResponse.json(userData);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
