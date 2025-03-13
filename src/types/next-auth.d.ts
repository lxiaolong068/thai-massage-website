import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

// 扩展NextAuth的User类型
declare module "next-auth" {
  interface User {
    role?: string;
    id?: string;
  }

  interface Session {
    user: {
      id?: string;
      role?: string;
    } & DefaultSession["user"];
  }
}

// 扩展JWT类型
declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    id?: string;
  }
}
