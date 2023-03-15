import { NextApiRequest, NextApiResponse } from "next";

import { getCurrentUserDetails } from "@/pages/api/auth/[...nextauth]";
import { connectDatabase } from "@/utils/db";
import People from "@/models/people";
import { peopleSchema } from "@/validators";

async function generateSimpleToken(length: number) {
  let result = "";
  const characters = "0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  const user = await People.find({ token: result });
  if (user.length === 0) return result;
  else await generateSimpleToken(length);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDatabase().catch(() =>
    res.json({ status: "ERROR", message: "Internal Server Error" })
  );

  try {
    const user = await getCurrentUserDetails({ req, res });

    if (!user)
      return res
        .status(404)
        .json({ status: "ERROR", message: "User not found!" });

    /*
      @GET /api/users/info
      @desc Get current user information
    */
    if (req.method === "GET") {
      const peoples = await People.find();

      return res.json({ status: "OK", peoples });
    }

    if (req.method === "POST") {
      const parsed = peopleSchema.safeParse(req.body);
      if (!parsed.success)
        return res.status(422).json({
          status: "ERROR",
          message: "Validation Error Occurred",
          error: parsed.error,
        });

      const { data } = parsed;

      const token = await generateSimpleToken(5);
      const people = await People.create({
        ...data,
        token,
      });

      return res.json({
        status: "OK",
        people,
        message: "People created successfully",
      });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ status: "ERROR", message: (error as Error).message });
  }
}
