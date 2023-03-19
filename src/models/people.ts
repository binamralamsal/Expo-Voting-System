import mongoose from "mongoose";

export interface IPeople {
  _id: string;
  name: string;
  phoneNumber: string;
  token: string;
}

const peopleSchema = new mongoose.Schema<IPeople>(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    token: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const People =
  mongoose.models.People || mongoose.model<IPeople>("People", peopleSchema);
export default People;
