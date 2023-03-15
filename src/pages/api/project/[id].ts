import { NextApiRequest, NextApiResponse } from "next";

import { getCurrentUserDetails } from "@/pages/api/auth/[...nextauth]";
import { connectDatabase } from "@/utils/db";
import { peopleSchema, projectSchema } from "@/validators";
import Project, { IProject } from "@/models/project";
import User, { IUser } from "@/models/user";
import People, { IPeople } from "@/models/people";

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

    if (req.method === "GET") {
      const project = (
        await Project.find({
          _id: req.query.id as string,
        })
      )[0] as any as IProject;

      const usersList: IPeople[] = [];
      for await (const vote of project.votes) {
        const people = (await People.findOne({
          token: vote,
        })) as any as IPeople;
        if (!people) continue;

        usersList.push(people);
      }

      return res.json({
        status: "OK",
        project,
        users: usersList,
      });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ status: "ERROR", message: (error as Error).message });
  }
}
