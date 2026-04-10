import { Field, Float, GraphQLISODateTime, InputType, Int } from "type-graphql";
import { TransactionType } from "../../models/transaction.model";

@InputType()
export class CreateTransactionInput {
	@Field(() => String)
	name!: string;

	@Field(() => Float)
	amount!: number;

	@Field(() => TransactionType)
	type!: TransactionType;

	@Field(() => GraphQLISODateTime)
	date!: Date;

	@Field(() => String)
	categoryId!: string;
}

@InputType()
export class UpdateTransactionInput {
	@Field(() => String, { nullable: true })
	name?: string;

	@Field(() => Float, { nullable: true })
	amount?: number;

	@Field(() => TransactionType, { nullable: true })
	type?: TransactionType;

	@Field(() => GraphQLISODateTime, { nullable: true })
	date?: Date;

	@Field(() => String, { nullable: true })
	categoryId?: string;
}

@InputType()
export class ListTransactionsFilterInput {
	@Field(() => String, { nullable: true })
	search?: string;

	@Field(() => TransactionType, { nullable: true })
	type?: TransactionType;

	@Field(() => String, { nullable: true })
	categoryId?: string;

	@Field(() => Int, { nullable: true })
	month?: number;

	@Field(() => Int, { nullable: true })
	year?: number;
}

@InputType()
export class PaginationInput {
	@Field(() => Int, { defaultValue: 1 })
	page: number = 1;

	@Field(() => Int, { defaultValue: 10 })
	pageSize: number = 10;
}
