import { prismaClient } from "../../prisma/prisma";
import type {
	CreateCategoryInput,
	UpdateCategoryInput,
} from "../dtos/input/category.input";

export class CategoryService {
	async findCategoryById(id: string, userId: string) {
		const category = await prismaClient.category.findFirst({
			where: { id, userId },
		});

		if (!category) throw new Error("Category not found");

		return category;
	}

	async createCategory(dto: CreateCategoryInput, userId: string) {
		const existingCategory = await prismaClient.category.findFirst({
			where: { title: dto.title, userId },
		});

		if (existingCategory) throw new Error("Category already exists!");

		const result = await prismaClient.category.create({
			data: { ...dto, userId },
		});
		return result;
	}

	async listCategory(userId: string) {
		const category = await prismaClient.category.findMany({
			where: { userId },
		});

		return category;
	}

	async updateCategory(id: string, data: UpdateCategoryInput) {
		const category = await prismaClient.category.findFirst({
			where: { id },
		});

		if (!category) throw new Error("Category not found");

		return prismaClient.category.update({
			where: { id },
			data,
		});
	}

	async deleteCategory(id: string, userId: string) {
		const category = await prismaClient.category.findFirst({
			where: { id, userId },
		});

		if (!category) throw new Error("Category not found");

		await prismaClient.transaction.deleteMany({ where: { categoryId: id } });
		await prismaClient.category.delete({ where: { id } });

		return category;
	}
}
