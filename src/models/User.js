import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const productSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    last_access: {
      type: Date
    },
    admission_date: {
      type: Date,
    },
    user_id: {
      type: String,
      required: true
    },
    user_state: {
      type: String,
      required: true
    },
    theme: {
      type: String
    },
    company_position: {
      type: String
    },
    department: {
      type: String
    },
    birthdate: {
      type: Date
    },
    skills: {
      type: [String]
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

productSchema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

productSchema.statics.comparePassword = async (password, receivedPassword) => {
  return await bcrypt.compare(password, receivedPassword)
}

productSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  const hash = await bcrypt.hash(user.password, 10);
  user.password = hash;
  next();
})

export default mongoose.model("User", productSchema);
