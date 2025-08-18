import prisma from "../../server/db";

export const generateUniqueUsername = async (
  baseName: string
): Promise<string> => {
  let username = baseName.toLowerCase().replace(/[^a-z0-9]/g, "");
  let counter = 0;

  while (true) {
    const testUsername = counter === 0 ? username : `${username}${counter}`;

    const existingUser = await prisma.user.findUnique({
      where: { username: testUsername },
    });

    if (!existingUser) {
      return testUsername;
    }

    counter++;
  }
};
