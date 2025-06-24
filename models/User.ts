import mongoose,{ Schema, models, model} from "mongoose";
import bcrypt from "bcryptjs";


// Create User Interface 
export interface IUser{
    email : string;
    password : string;
    _id ? : mongoose.Types.ObjectId
    createdAt ?: Date;
    updatedAt ?: Date;

}

const userSchema = new Schema<IUser> ({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    // _id: mongoose.Types.ObjectId,
  
},{timestamps: true} )

// Pre-save middleware to hash the password
userSchema.pre('save', async function (next) {

  // Only hash the password if it has been modified or is new
  if (!this.isModified('password')) return next();
  
  // Generate salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();

});

const User = models?.User || model<IUser>("User", userSchema)
export default User;
