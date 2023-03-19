import { NextApiRequest, NextApiResponse } from "next";

import { getCurrentUserDetails } from "@/pages/api/auth/[...nextauth]";
import { connectDatabase } from "@/utils/db";
import { peopleSchema, projectSchema } from "@/validators";
import Project from "@/models/project";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDatabase().catch(() =>
    res.json({ status: "ERROR", message: "Internal Server Error" })
  );

  try {
    if (req.method === "GET") {
      const projects = await Project.find();

      return res.json({ status: "OK", projects });
    }

    let user;
    try {
      user = await getCurrentUserDetails({ req, res });
    } catch (error) {
      //   Empty
    }

    if (!user)
      return res
        .status(404)
        .json({ status: "ERROR", message: "User not found!" });

    if (req.method === "POST") {
      const parsed = projectSchema.safeParse(req.body);
      if (!parsed.success)
        return res.status(422).json({
          status: "ERROR",
          message: "Validation Error Occurred",
          error: parsed.error,
        });

      const { data } = parsed;

      const project = await Project.create(data);

      return res.json({
        status: "OK",
        project,
        message: "Project created successfully",
      });
    }
    2;
  } catch (error) {
    return res
      .status(400)
      .json({ status: "ERROR", message: (error as Error).message });
  }
}
