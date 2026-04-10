import { prismaClient } from "../../prisma/prisma";
import type {
	CreateTransactionInput,
	ListTransactionsFilterInput,
	PaginationInput,
	UpdateTransactionInput,
} from "../dtos/input/transaction.input";

export class TransactionService {
	async findTransactionById(id: string, userId: string) {
		const transaction = await prismaClient.transaction.findFirst({
			where: { id, userId },
		});

		if (!transaction) throw new Error("Transaction not found");

		return transaction;
	}

	async createTransaction(dto: CreateTransactionInput, userId: string) {
		return prismaClient.transaction.create({
			data: { ...dto, userId },
		});
	}

	async listTransactions(userId: string) {
		return prismaClient.transaction.findMany({
			where: { userId },
		});
	}

	async listTransactionsPaginated(
		userId: string,
		filter: ListTransactionsFilterInput,
		pagination: PaginationInput,
	) {
		const where: any = { userId };

		if (filter.type) where.type = filter.type;
		if (filter.categoryId) where.categoryId = filter.categoryId;
		if (filter.search) where.name = { contains: filter.search };
		if (filter.month && filter.year) {
			const start = new Date(filter.year, filter.month - 1, 1);
			const end = new Date(filter.year, filter.month, 1);
			where.date = { gte: start, lt: end };
		}

		const skip = (pagination.page - 1) * pagination.pageSize;

		const [data, total] = await Promise.all([
			prismaClient.transaction.findMany({
				where,
				skip,
				take: pagination.pageSize,
				orderBy: { date: "desc" },
			}),
			prismaClient.transaction.count({ where }),
		]);

		return {
			data,
			total,
			page: pagination.page,
			pageSize: pagination.pageSize,
			totalPages: Math.max(1, Math.ceil(total / pagination.pageSize)),
		};
	}

	async updateTransaction(
		id: string,
		userId: string,
		data: UpdateTransactionInput,
	) {
		const transaction = await prismaClient.transaction.findFirst({
			where: { id, userId },
		});

		if (!transaction) throw new Error("Transaction not found");

		return prismaClient.transaction.update({
			where: { id },
			data,
		});
	}

	async deleteTransaction(id: string, userId: string) {
		const transaction = await prismaClient.transaction.findFirst({
			where: { id, userId },
		});

		if (!transaction) throw new Error("Transaction not found");

		return prismaClient.transaction.delete({
			where: { id },
		});
	}
}
