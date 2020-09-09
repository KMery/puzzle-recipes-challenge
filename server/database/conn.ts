import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";

import { UserResolver } from '../../resolvers/UserResolver';
import { CategoryResolver } from '../../resolvers/CategoryResolver';
import { RecipeResolver } from '../../resolvers/RecipeResolver';

export async function startConn(port: any)  {
    try {
        const connection = await createConnection().then(connection => {
            console.log('DB is connected!')
        }).catch(error => console.log(error));
        
        
        const schema = await buildSchema({
            resolvers: [
                UserResolver,
                CategoryResolver,
                RecipeResolver
            ],
            validate: false
            // context: ({ req }) => {
                // return {
                //   req: req
                // }
        });
        const server = new ApolloServer({ 
            schema,
            context: ({ req }) => {
                const context = {
                  req
                };
                return context;
              },
        });
        
        await server.listen(port);
        console.log(`Server Apollo has started! go to http://localhost:${port}/`);
    } catch (error) {
        console.log(error);
        throw error;
    }
  }
