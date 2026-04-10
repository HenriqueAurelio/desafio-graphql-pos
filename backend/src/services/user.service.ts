import { prismaClient } from "../../prisma/prisma";
import type { UpdateUserInput } from "../dtos/input/user.input";

export class UserService {
	async findUserById(id: string) {
		const user = await prismaClient.user.findUnique({
			where: { id },
		});

		if (!user) throw new Error("User not found");

		return user;
	}

	async updateUser(id: string, dto: UpdateUserInput) {
		return prismaClient.user.update({
			where: { id },
			data: { name: dto.name },
		});
	}
}
