import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { UserModel } from "../models/user.model";
import { UserService } from "../services/user.service";
import { UpdateUserInput } from "../dtos/input/user.input";
import { GqlUser } from "../graphql/decorators/user.decorator";
import type { User } from "../../prisma/generated/prisma/client";
import { IsAuth } from "../middleware/auth.middleware";

@Resolver(() => UserModel)
export class UserResolver {
	private userService = new UserService();

	@Query(() => UserModel)
	async getUser(@Arg("id", () => String) id: string): Promise<UserModel> {
		return this.userService.findUserById(id);
	}

	@Query(() => UserModel)
	@UseMiddleware(IsAuth)
	async me(@GqlUser() user: User): Promise<UserModel> {
		return user;
	}

	@Mutation(() => UserModel)
	@UseMiddleware(IsAuth)
	async updateUser(
		@Arg("data", () => UpdateUserInput) data: UpdateUserInput,
		@GqlUser() user: User,
	): Promise<UserModel> {
		return this.userService.updateUser(user.id, data);
	}
}
