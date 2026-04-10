import { Field, Float, GraphQLISODateTime, ID, ObjectType, registerEnumType } from "type-graphql";
import { UserModel } from "./user.model";
import { CategoryModel } from "./category.model";
import { TransactionType } from "../../prisma/generated/prisma/enums";

export { TransactionType };

registerEnumType(TransactionType, {
	name: "TransactionType",
});

@ObjectType()
export class TransactionModel {
	@Field(() => ID)
	id!: string;

	@Field(() => String)
	name!: string;

	@Field(() => Float)
	amount!: number;

	@Field(() => TransactionType)
	type!: TransactionType;

	@Field(() => GraphQLISODateTime)
	date!: Date;

	@Field(() => String)
	userId!: string;

	@Field(() => String)
	categoryId!: string;

	@Field(() => UserModel, { nullable: true })
	user?: UserModel;

	@Field(() => CategoryModel, { nullable: true })
	category?: CategoryModel;

	@Field(() => GraphQLISODateTime)
	createdAt!: Date;

	@Field(() => GraphQLISODateTime)
	updatedAt!: Date;
}
