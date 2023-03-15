// noinspection ES6UnusedImports,JSUnusedGlobalSymbols

import { ObjectId } from "mongoose";
import NextAuth, { DefaultSession } from "next-auth";
import { CldUploadButton, CldUploadButtonProps } from "next-cloudinary";

import { IUser } from "@/models/user";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      email: string;
    };
  }
}
