import { NextApiRequest, NextApiResponse } from "next";

import { getCurrentUserDetails } from "@/pages/api/auth/[...nextauth]";
import { connectDatabase } from "@/utils/db";
import { peopleSchema, projectSchema, voteProjectSchema } from "@/validators";
import Project from "@/models/project";
import People from "@/models/people";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDatabase().catch(() =>
    res.json({ status: "ERROR", message: "Internal Server Error" })
  );

  try {
    if (req.method === "POST") {
      const parsed = voteProjectSchema.safeParse(req.body);
      if (!parsed.success)
        return res.status(422).json({
          status: "ERROR",
          message: "Validation Error Occurred",
          error: parsed.error,
        });

      const { data } = parsed;

      const tokenExists = await People.exists({ token: data.token });
      if (!tokenExists)
        return res.status(422).json({
          status: "ERROR",
          message: "Invalid Token",
          error: "Please recheck if your token is correct or not",
        });

      const projects = await Project.find({ votes: data.token });

      if (
        projects.length > 0 &&
        projects[0]._id.toHexString() === data.projectId
      )
        return res.status(422).json({
          status: "ERROR",
          message: "Invalid Action",
          error: "You can't vote same project twice",
        });

      await Project.updateMany(
        {},
        {
          $pull: {
            votes: data.token,
          },
        }
      );

      await Project.updateOne(
        {
          _id: data.projectId,
        },
        {
          $push: {
            votes: data.token,
          },
        }
      );

      return res.json({
        status: "OK",
        message: "Voted project successfully",
      });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ status: "ERROR", message: (error as Error).message });
  }
}
