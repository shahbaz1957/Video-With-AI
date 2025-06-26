import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
  try {
    const authenticationParametes = getUploadAuthParams({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
      publicKey: process.env.INEXT_PUBLIC_PUBLIC_KEY as string,
    });

    return Response.json({
      authenticationParametes,
      publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
    });
  } catch (error) {
    return Response.json(
      {
        error: "imagekit authentication errror ",
      },
      {
        status: 400,
      }
    );
  }
}
