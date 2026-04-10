import { Field, GraphQLISODateTime, ID, ObjectType } from "type-graphql";
import { UserModel } from "./user.model";

@ObjectType()
export class CategoryModel {
	@Field(() => ID)
	id!: string;

	@Field(() => String)
	title!: string;

	@Field(() => String)
	description!: string;

	@Field(() => String)
	icon!: string;

	@Field(() => String)
	color!: string;

	@Field(() => UserModel, { nullable: true })
	user?: UserModel;

	@Field(() => String)
	userId!: string;

	@Field(() => GraphQLISODateTime)
	createdAt!: Date;

	@Field(() => GraphQLISODateTime)
	updatedAt!: Date;
}
