import type { ExpressContextFunctionArgument } from "@as-integrations/express5";
import { type JwtPayload, verifyJwt } from "../../utils/jwt";

export type GraphqlContext = {
	user: string | undefined;
	token: string | undefined;
	req: ExpressContextFunctionArgument["req"];
	res: ExpressContextFunctionArgument["res"];
};

export const buildContext = async ({
	req,
	res,
}: ExpressContextFunctionArgument): Promise<GraphqlContext> => {
	const authHeader = req.headers.authorization;
	const cookieToken = (req as any).cookies?.token as string | undefined;
	const rawToken = authHeader?.startsWith("Bearer ")
		? authHeader.substring("Bearer ".length)
		: cookieToken;

	let user: string | undefined;
	let token: string | undefined;

	if (rawToken) {
		token = rawToken;
		try {
			const payload = verifyJwt(token) as JwtPayload;
			user = payload.id;
		} catch (error) {}
	}

	return { user, token, req, res };
};
