import People from "./src/models/people.js";
import * as dotenv from "dotenv";
import { connect } from "mongoose";
import Project from "@/models/project";

dotenv.config();

const init = async () => {
  await connect(process.env.MONGODB_URI as string);

  console.log("Peoples with duplicate name");

  const peoples1 = await People.aggregate([
    {
      $group: {
        _id: "$name",
        sum: { $sum: 1 },
      },
    },
    { $match: { sum: { $gt: 1 } } },
  ]);

  console.log(peoples1);

  for await (const people of peoples1) {
    const duplicatePeoples = await People.find({ name: people._id });
    const votes = [];
    for await (const p of duplicatePeoples) {
      const project = await Project.find();
    }
  }

  console.log();

  // console.log("Peoples with duplicate name");
  //
  // const peoples2 = await People.aggregate([
  //   { $group: { _id: "$phoneNumber", count: { $sum: 1 } } },
  //   { $match: { _id: { $ne: null }, count: { $gt: 1 } } },
  // ]);
  //
  // console.log(peoples2);
};

init();
