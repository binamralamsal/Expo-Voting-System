import People from "./src/models/people.js";
import * as dotenv from "dotenv";
import { connect } from "mongoose";
import Project from "./src/models/project.js";
import User from "./src/models/user.js";

dotenv.config();

const init = async () => {
  await connect(process.env.MONGODB_URI as string);

  const projects = await Project.find();

  const result: any = [];

  for (const project of projects) {
    const projectAlreadyExists = result.find(
      (p: any) => p.name === project.name
    );
    if (!projectAlreadyExists) {
      result.push({ name: project.name, count: 0 });
    }

    for (const vote of project.votes) {
      const user = await User.find({ token: vote });
      if (user) {
        const projectFromResult = result.find(
          (r: any) => r.name === project.name
        );
        projectFromResult.count++;
      }
    }
  }

  console.log(result);
};

init();
