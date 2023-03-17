import People from "./src/models/people.js";
import * as dotenv from "dotenv";
import { connect } from "mongoose";

dotenv.config();

const init = async () => {
  await connect(process.env.MONGODB_URI as string);

  console.log("Peoples with duplicate name");
  const peoples1 = await People.aggregate([
    { $group: { _id: "$name", count: { $sum: 1 } } },
    { $match: { _id: { $ne: null }, count: { $gt: 1 } } },
    { $project: { name: "$_id", _id: 0 } },
  ]);

  console.log(peoples1);

  console.log();

  console.log("Peoples with duplicate name");
  const peoples2 = await People.aggregate([
    { $group: { _id: "$phoneNumber", count: { $sum: 1 } } },
    { $match: { _id: { $ne: null }, count: { $gt: 1 } } },
    { $project: { name: "$_id", _id: 0 } },
  ]);

  console.log(peoples2);
};

init();
