import { UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { envVars } from "../config/env";
import prisma from "../src/shared/prisma";

const seedSuperAdmin = async () => {
  try {
    const isExistSuperAdmin = await prisma.user.findFirst({
      where: {
        role: UserRole.SUPER_ADMIN,
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
        email: envVars.SUPER_ADMIN_EMAIL,
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        admin: {
          create: {
            name: "Super Admin",
            email: envVars.SUPER_ADMIN_EMAIL,
            contactNumber: "01234567890",
          },
        },
      },
    });

    console.log("Super Admin Created Successfully!", superAdminData);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
};

seedSuperAdmin();
