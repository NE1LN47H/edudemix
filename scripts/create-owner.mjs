
import bcrypt from "bcryptjs";
import connectToDatabase from "../src/lib/mongodb.js";
import Centre from "../src/models/Centre.js";
import User from "../src/models/User.js";

const {
  BOOTSTRAP_CENTRE_NAME,
  BOOTSTRAP_CENTRE_SLUG,
  BOOTSTRAP_OWNER_NAME,
  BOOTSTRAP_OWNER_EMAIL,
  BOOTSTRAP_OWNER_PASSWORD,
} = process.env;

async function main() {
  if (
    !BOOTSTRAP_CENTRE_NAME ||
    !BOOTSTRAP_CENTRE_SLUG ||
    !BOOTSTRAP_OWNER_NAME ||
    !BOOTSTRAP_OWNER_EMAIL ||
    !BOOTSTRAP_OWNER_PASSWORD
  ) {
    throw new Error("Missing bootstrap environment variables");
  }

  if (
    !/^[a-z0-9-]+$/.test(BOOTSTRAP_CENTRE_SLUG) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(BOOTSTRAP_OWNER_EMAIL) ||
    BOOTSTRAP_OWNER_PASSWORD.length < 12 ||
    BOOTSTRAP_OWNER_PASSWORD.length > 72
  ) {
    throw new Error(
      "Invalid slug/email or password length (use 12–72 characters)"
    );
  }

  await connectToDatabase();

  // Only allow initial setup on an empty installation.
  if (await Centre.exists({})) {
    throw new Error(
      "A centre already exists. Initial setup is disabled."
    );
  }

  const centre = await Centre.create({
    name: BOOTSTRAP_CENTRE_NAME.trim(),
    slug: BOOTSTRAP_CENTRE_SLUG,
  });

  try {
    const passwordHash = await bcrypt.hash(
      BOOTSTRAP_OWNER_PASSWORD,
      12
    );

    await User.create({
      centreId: centre._id,
      name: BOOTSTRAP_OWNER_NAME.trim(),
      email: BOOTSTRAP_OWNER_EMAIL.trim().toLowerCase(),
      passwordHash,
      role: "owner",
      status: "active",
    });
  } catch (error) {
    await Centre.deleteOne({ _id: centre._id });
    throw error;
  }

  console.log("Initial owner created successfully.");
  console.log(`Centre slug: ${centre.slug}`);
  console.log(`Owner email: ${BOOTSTRAP_OWNER_EMAIL}`);
}

try {
  await main();
} catch (error) {
  console.error("Initial setup failed:", error.message);
  process.exitCode = 1;
} finally {
  const mongoose = await import("mongoose");
  await mongoose.default.disconnect();
}
