import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: " email and password is required" },
        { status: 400 }
      );
    }
    // Why we do it => Ensures connection is alive before DB queries

    await dbConnect();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ error: "User alredy extis" }, { status: 400 });
    }

    const hashedPassword = await  bcrypt.hash(password,10);



    await User.create({
      email: email,
      password: hashedPassword,
    });
    return NextResponse.json(
      { message: "User Registered successfully !!!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("User Registration Failed ",error);
    return NextResponse.json(
      { message: "Failed to  Registered" },
      { status: 400 }
    );
  }
}
