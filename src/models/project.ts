import mongoose from "mongoose";

export type UserRole = "superuser" | "user";

export interface IProject {
  _id: string;
  name: string;
  votes: [];
}

const IProject = new mongoose.Schema<IProject>(
  {
    name: { type: String, required: true },
    votes: { type: [], ref: "People", required: true },
  },
  {
    timestamps: true,
  }
);

const Project =
  mongoose.models.Project || mongoose.model<IProject>("Project", IProject);
export default Project;
