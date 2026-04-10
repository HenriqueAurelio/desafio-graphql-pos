import "dotenv/config";
import "reflect-metadata";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApolloServer } from "@apollo/server";
import { buildSchema } from "type-graphql";
import { expressMiddleware } from "@as-integrations/express5";
import { UserResolver } from "./resolvers/user.resolver";
import { AuthResolver } from "./resolvers/auth.resolver";
import { buildContext } from "./graphql/context";
import { CategoryResolver } from "./resolvers/category.resolver";
import { TransactionResolver } from "./resolvers/transaction.resolver";

async function bootstrap() {
	const app = express();

	app.use(cors({
		origin: true,
		credentials: true,
	}));
	app.use(cookieParser());

	const schema = await buildSchema({
		resolvers: [AuthResolver, UserResolver, CategoryResolver, TransactionResolver],
		validate: false,
		emitSchemaFile: "./schema.graphql",
	});

	const server = new ApolloServer({
		schema,
		includeStacktraceInErrorResponses: false,
	});

	await server.start();

	app.use(
		"/graphql",
		express.json(),
		expressMiddleware(server, {
			context: buildContext,
		}),
	);

	const port = Number(process.env.PORT) || 4000;

	app.listen({ port }, () => {
		console.log(`Servidor iniciado na porta ${port}!`);
	});
}

bootstrap();
