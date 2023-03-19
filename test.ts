import People from "./src/models/people.js";
import * as dotenv from "dotenv";
import { connect } from "mongoose";
import Project from "./src/models/project.js";

dotenv.config();

const init = async () => {
  await connect(process.env.MONGODB_URI as string);

  console.log("Peoples with duplicate name");

  // const peoples = await People.aggregate([
  //   {
  //     $group: {
  //       _id: "$name",
  //       sum: { $sum: 1 },
  //     },
  //   },
  //   { $match: { sum: { $gt: 1 } } },
  // ]);

  const peoples = await People.aggregate([
    { $group: { _id: "$phoneNumber", count: { $sum: 1 } } },
    { $match: { _id: { $ne: null }, count: { $gt: 1 } } },
  ]);

  const duplicateVotes: any = [];

  for await (const people of peoples) {
    // const duplicatePeoples = await People.find({ name: people._id });
    const duplicatePeoples = await People.find({ phoneNumber: people._id });
    const votes = [];
    for await (const p of duplicatePeoples) {
      const project = await Project.find({
        votes: p.token,
      });

      for (const a of project) {
        votes.push({ people: p.name, token: p.token, project: a.name });
      }
    }

    for (const vote of votes) {
      const voteAlreadyExists = duplicateVotes.find(
        (v: any) => v.people === vote.people
      );

      if (voteAlreadyExists) {
        voteAlreadyExists.count++;
        voteAlreadyExists.project.push(vote.project);
      } else {
        duplicateVotes.push({ count: 1, ...vote, project: [vote.project] });
      }
    }
  }
  // console.log(duplicateVotes);
  const foolishVotes = duplicateVotes.filter((d: any) => d.count > 1);
  console.log(foolishVotes);

  console.log();

  // console.log("Peoples with duplicate name");
  //

  // console.log(peoples2);
};

init();
