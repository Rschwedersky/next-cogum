
import { auth, firestore } from "@/firebase/server";
import { UserRecord, DecodedIdToken } from "firebase-admin/auth";
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
      const listUsersResult = await auth?.listUsers( );
      const users = listUsersResult?.users.map((userRecord: UserRecord) => userRecord.toJSON());
      return NextResponse.json(users);
  } catch (error) {
      return new NextResponse("Internal Error", { status: 500 });
  }
}


/* 
const listAllUsers:ListUsersResult = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const auth = getAuth();

    // Check for authorization header and validate token on the server-side
    // (Implementation omitted for brevity, see security considerations below)
    if (!isValidAuthToken(req.headers.authorization)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const nextPageToken = req.query.nextPageToken as string || ""; // Get pagination token from query parameter
    const limit = 1000; // Maximum users per request

    // Fetch initial batch of users with pagination
    const listUsersResult = await auth.listUsers( limit, nextPageToken);

    // Process retrieved users
    const users = listUsersResult.users.map((userRecord: UserRecord) => userRecord.toJSON());

    // Check for next page token and recursively call if necessary
    if (listUsersResult.pageToken) {
      const nextUsers = await listAllUsers(req, { ...req.query, nextPageToken: listUsersResult.pageToken });
      return res.status(200).json([...users, ...nextUsers]); // Combine results from current and next pages
    }

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error listing users:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Security considerations (replace with your actual implementation)
function isValidAuthToken(authorization: string | undefined): boolean {
  // Implement server-side token verification using the Firebase Admin SDK
  // or a secure authentication library. Return true if valid, false otherwise.
  return false; // Placeholder, replace with actual implementation
}

export default listAllUsers; */