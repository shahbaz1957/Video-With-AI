import mongoose, { Schema, models, model } from "mongoose";

// Default video dimensions
export const VIDEO_DIMENSIONS = {
  height: 1080,
  width: 1920,
} as const;

// Video interface
export interface IVideo {
  _id?: mongoose.Types.ObjectId;
  title: string;
  descreption: string;
  videoURL: string;
  thumbnailURL: string;
  controls?: boolean;
  tranformation?: {
    height: number;
    width: number;
    quality?: number;
  };
}

// Video schema definition
const videoSchema = new Schema<IVideo>(
  {
    title: {
      type: String,
      required: true,
    },
    descreption: {
      type: String,
      required: true,
    },
    videoURL: {
      type: String,
      required: true,
    },
    thumbnailURL: {
      type: String,
      required: true,
    },
    controls: {
      type: Boolean,
      default: true,
    },
    tranformation: {
      height: {
        type: Number,
        default: VIDEO_DIMENSIONS.height,
      },
      width: {
        type: Number,
        default: VIDEO_DIMENSIONS.width,
      },
      quality: {
        type: Number,
        min: 1,
        max: 100,
      },
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Reuse existing model if already defined
const Video = models?.Video || model<IVideo>("Video", videoSchema);
export default Video;