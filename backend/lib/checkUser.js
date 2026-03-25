import { clerkClient } from "@clerk/clerk-sdk-node";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export const checkUser = async (clerkUserId) => {
  if (!clerkUserId) {
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: clerkUserId,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    // User is not in DB, fetch from Clerk API
    const user = await clerkClient.users.getUser(clerkUserId);
    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    const primaryEmailObj = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId) || user.emailAddresses[0];

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: primaryEmailObj?.emailAddress || "",
      },
    });

    return newUser;
  } catch (error) {
    console.log("Error in checkUser sync:", error.message);
    return null;
  }
};
