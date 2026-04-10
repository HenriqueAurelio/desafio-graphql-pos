import { createParameterDecorator, type ResolverData } from "type-graphql";
import type { GraphqlContext } from "../context";
import type { UserModel } from "../../models/user.model";
import { prismaClient } from "../../../prisma/prisma";

export const GqlUser = () => {
	return createParameterDecorator(
		async ({
			context,
		}: ResolverData<GraphqlContext>): Promise<UserModel | null> => {
			if (!context || !context.user) return null;

			try {
				const user = await prismaClient.user.findUnique({
					where: {
						id: context.user,
					},
				});
				if (!user) throw new Error("User not found");
				return user;
			} catch (error) {
				console.log("Error on initializing GqlUser decorator:", error);
			}
		},
	);
};
