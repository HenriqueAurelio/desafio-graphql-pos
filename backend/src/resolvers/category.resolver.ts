import {
	Arg,
	Mutation,
	Query,
	Resolver,
	UseMiddleware,
	FieldResolver,
	Root,
} from "type-graphql";
import { CategoryModel } from "../models/category.model";
import { CategoryService } from "../services/category.service";
import {
	CreateCategoryInput,
	UpdateCategoryInput,
} from "../dtos/input/category.input";
import { GqlUser } from "../graphql/decorators/user.decorator";
import type { User } from "../../prisma/generated/prisma/client";
import { IsAuth } from "../middleware/auth.middleware";
import { UserModel } from "../models/user.model";
import { UserService } from "../services/user.service";

@Resolver(() => CategoryModel)
@UseMiddleware(IsAuth)
export class CategoryResolver {
	private categoryService = new CategoryService();
	private userService = new UserService();

	@Query(() => CategoryModel)
	async getCategory(
		@Arg("id", () => String) id: string,
		@GqlUser() user: User,
	): Promise<CategoryModel> {
		return this.categoryService.findCategoryById(id, user.id);
	}

	@Mutation(() => CategoryModel)
	async createCategory(
		@Arg("data", () => CreateCategoryInput) data: CreateCategoryInput,
		@GqlUser() user: User,
	): Promise<CategoryModel> {
		return this.categoryService.createCategory(data, user.id);
	}

	@Mutation(() => CategoryModel)
	async updateCategory(
		@Arg("id", () => String) id: string,
		@Arg("data", () => UpdateCategoryInput) data: UpdateCategoryInput,
	): Promise<CategoryModel> {
		return this.categoryService.updateCategory(id, data);
	}

	@Query(() => [CategoryModel])
	async listCategory(@GqlUser() user: User): Promise<CategoryModel[]> {
		return this.categoryService.listCategory(user.id);
	}

	@Mutation(() => CategoryModel)
	async deleteCategory(
		@Arg("id", () => String) id: string,
		@GqlUser() user: User,
	): Promise<CategoryModel> {
		return this.categoryService.deleteCategory(id, user.id);
	}

	@FieldResolver(() => UserModel)
	async user(@Root() category: CategoryModel): Promise<UserModel> {
		return this.userService.findUserById(category.userId);
	}
}
