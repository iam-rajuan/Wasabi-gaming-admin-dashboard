import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      userId: string;
      email: string;
      role: string;
      accessToken: string;
    };
  }

  interface User {
    id: string;
    email: string;
    role: string;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    email: string;
    role: string;
    accessToken: string;
  }
}
