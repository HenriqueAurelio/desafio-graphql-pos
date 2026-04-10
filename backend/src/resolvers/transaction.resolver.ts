import {
	Arg,
	FieldResolver,
	Mutation,
	Query,
	Resolver,
	Root,
	UseMiddleware,
} from "type-graphql";
import { TransactionModel } from "../models/transaction.model";
import { TransactionService } from "../services/transaction.service";
import {
	CreateTransactionInput,
	ListTransactionsFilterInput,
	PaginationInput,
	UpdateTransactionInput,
} from "../dtos/input/transaction.input";
import { PaginatedTransactionsOutput } from "../dtos/output/transaction.output";
import { GqlUser } from "../graphql/decorators/user.decorator";
import type { User } from "../../prisma/generated/prisma/client";
import { IsAuth } from "../middleware/auth.middleware";
import { UserModel } from "../models/user.model";
import { CategoryModel } from "../models/category.model";
import { UserService } from "../services/user.service";
import { CategoryService } from "../services/category.service";

@Resolver(() => TransactionModel)
@UseMiddleware(IsAuth)
export class TransactionResolver {
	private transactionService = new TransactionService();
	private userService = new UserService();
	private categoryService = new CategoryService();

	@Query(() => TransactionModel)
	async getTransaction(
		@Arg("id", () => String) id: string,
		@GqlUser() user: User,
	): Promise<TransactionModel> {
		return this.transactionService.findTransactionById(id, user.id);
	}

	@Query(() => [TransactionModel])
	async listTransactions(@GqlUser() user: User): Promise<TransactionModel[]> {
		return this.transactionService.listTransactions(user.id);
	}

	@Query(() => PaginatedTransactionsOutput)
	async listTransactionsPaginated(
		@Arg("filter", () => ListTransactionsFilterInput) filter: ListTransactionsFilterInput,
		@Arg("pagination", () => PaginationInput) pagination: PaginationInput,
		@GqlUser() user: User,
	): Promise<PaginatedTransactionsOutput> {
		return this.transactionService.listTransactionsPaginated(user.id, filter, pagination);
	}

	@Mutation(() => TransactionModel)
	async createTransaction(
		@Arg("data", () => CreateTransactionInput) data: CreateTransactionInput,
		@GqlUser() user: User,
	): Promise<TransactionModel> {
		return this.transactionService.createTransaction(data, user.id);
	}

	@Mutation(() => TransactionModel)
	async updateTransaction(
		@Arg("id", () => String) id: string,
		@Arg("data", () => UpdateTransactionInput) data: UpdateTransactionInput,
		@GqlUser() user: User,
	): Promise<TransactionModel> {
		return this.transactionService.updateTransaction(id, user.id, data);
	}

	@Mutation(() => TransactionModel)
	async deleteTransaction(
		@Arg("id", () => String) id: string,
		@GqlUser() user: User,
	): Promise<TransactionModel> {
		return this.transactionService.deleteTransaction(id, user.id);
	}

	@FieldResolver(() => UserModel)
	async user(@Root() transaction: TransactionModel): Promise<UserModel> {
		return this.userService.findUserById(transaction.userId);
	}

	@FieldResolver(() => CategoryModel)
	async category(@Root() transaction: TransactionModel): Promise<CategoryModel> {
		return this.categoryService.findCategoryById(transaction.categoryId, transaction.userId);
	}
}
