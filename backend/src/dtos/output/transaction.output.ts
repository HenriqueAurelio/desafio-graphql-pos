import { Field, Int, ObjectType } from "type-graphql";
import { TransactionModel } from "../../models/transaction.model";

@ObjectType()
export class PaginatedTransactionsOutput {
	@Field(() => [TransactionModel])
	data!: TransactionModel[];

	@Field(() => Int)
	total!: number;

	@Field(() => Int)
	page!: number;

	@Field(() => Int)
	pageSize!: number;

	@Field(() => Int)
	totalPages!: number;
}
