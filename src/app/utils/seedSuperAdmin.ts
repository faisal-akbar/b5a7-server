import { Role } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { prisma } from "../config/db";
import { envVars } from "../config/env";

export const seedSuperAdmin = async () => {
  try {
    const isExistSuperAdmin = await prisma.user.findFirst({
      where: {
        role: Role.SUPER_ADMIN,
      },
    });

    if (isExistSuperAdmin) {
      console.log("Super admin already exists!");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const superAdminData = await prisma.user.create({
      data: {
        name: "Super admin",
        role: Role.SUPER_ADMIN,
        email: envVars.SUPER_ADMIN_EMAIL,
        password: hashedPassword,
        isVerified: true,
      },
    });

    console.log("Super Admin Created Successfully!", superAdminData);
  } catch (err) {
    console.error(err);
  }
};
