import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { LoginInput, RegisterInput } from "../dtos/input/auth.input";
import { LoginOutput, RegisterOutput } from "../dtos/output/auth.output";
import { AuthService } from "../services/auth.service";
import type { GraphqlContext } from "../graphql/context";

const COOKIE_OPTIONS = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "lax" as const,
	maxAge: 7 * 24 * 60 * 60 * 1000,
	path: "/",
};

@Resolver()
export class AuthResolver {
	private authService = new AuthService();

	@Mutation(() => LoginOutput)
	async login(
		@Arg("data", () => LoginInput) data: LoginInput,
		@Ctx() ctx: GraphqlContext,
	): Promise<LoginOutput> {
		const result = await this.authService.login(data);
		ctx.res.cookie("token", result.token, COOKIE_OPTIONS);
		return result;
	}

	@Mutation(() => RegisterOutput)
	async register(
		@Arg("data", () => RegisterInput) data: RegisterInput,
		@Ctx() ctx: GraphqlContext,
	): Promise<RegisterOutput> {
		const result = await this.authService.register(data);
		ctx.res.cookie("token", result.token, COOKIE_OPTIONS);
		return result;
	}

	@Mutation(() => Boolean)
	logout(@Ctx() ctx: GraphqlContext): boolean {
		ctx.res.clearCookie("token", { path: "/" });
		return true;
	}
}
