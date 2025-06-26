import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const video = await Video.find({}).sort({ createdAt: -1 }).lean();

    if (!video || video.length === 0) {
      return NextResponse.json([], { status: 400 });
    }

    return NextResponse.json(video);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
    try {
         // Access the current user’s session (login info) on the server side — securely.
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized to post video" },
      { status: 401 }
    );
  }
  // session is available
  await dbConnect(); // dbConnect if not

  const body: IVideo = await request.json();

  if (
    !body.title ||
    !body.descreption ||
    !body.videoURL ||
    !body.thumbnailURL
  ) {
    return NextResponse.json(
      { error: "Missing REquirede Fields " },
      { status: 401 }
    );
  }

  const videoData = {
    ...body,
    controls: body?.controls ?? true,
    tranformation: {
      height: 1080,
      width: 1920,
      quality: body?.tranformation?.quality ?? 100,
    },
  };

  const newVideo = Video.create(videoData);

  return NextResponse.json(newVideo,{ status: 201 });
    } catch (error) {
        return NextResponse.json(
            {error: "Failed to create video"},
            {status: 500}
        )
    }
}
