import People, { IPeople } from "./src/models/people.js";
import * as dotenv from "dotenv";
import { connect } from "mongoose";
import Project from "./src/models/project.js";
import User, { IUser } from "./src/models/user.js";

dotenv.config();

const init = async () => {
  await connect(process.env.MONGODB_URI as string);

  const peoples = await People.find({
    createdAt: {
      $lte: new Date(2023, 2, 17, 5),
      $gte: new Date(2023, 2, 16, 16),
    },
  });
  console.log(peoples);
  // const user = (await People.findOne({
  //   name: "Binamra Lamsal",
  // })) as any as IPeople;
  // console.log(
  //   new Date(user.createdAt).getHours(),
  //   new Date(user.createdAt).getTime(),
  //   new Date(user.createdAt).getMinutes(),
  //
  //   user
  // );
};

init();
