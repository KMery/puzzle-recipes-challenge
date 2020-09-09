import { Resolver, Query, Mutation, Arg, UseMiddleware, ObjectType, Field, Ctx } from "type-graphql";
import { hash, compare } from "bcrypt";
import { sign } from 'jsonwebtoken';

import { User } from '../entities/User';
import { CreateUserInput } from "../inputs/UserInputs/CreateUserInput";
import { UpdateUserInput } from "../inputs/UserInputs/UpdateUserInput";
import { checkJWT } from "../middleware/checkJWT";
import { LoginUserInput } from "../inputs/UserInputs/LoginUserInput";
import CONFIG from '../config'
import { MyContext } from '../middleware/myContext';

//This object is necesary for the login mutation
@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

//The famous UserResolvers
@Resolver()
export class UserResolver {
  //I let this Query comment in case you want to use it. This will give you all the users, you don't need to singUp or LogIn, is just for testing purpuse
  // @Query(() => [User!])
  // async getUsers() {
  //   return User.find()
  // }

  @Query(() => User)
  @UseMiddleware(checkJWT)
    async getUser(@Ctx() { payload }: MyContext) {
      return await User.findOne({ where: { email: payload?.email } });
  }
 
  // create a new user
  @Mutation(() => User)
  async singUp(@Arg("input") input: CreateUserInput) {
    const hashedPassword = await hash(input.password, 12);
    if (input.email.length === 0) throw new Error("Email can't be empty!");
    try {
      let user = await User.findOne({where: {email: input.email} });
      if (user?.email) throw new Error("Email already in use!");
      await User.insert({name: input.name, email: input.email, password: hashedPassword});
      user = await User.findOne({where: {email: input.email}});
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Update the logged in user
  @Mutation(() => User)
  @UseMiddleware(checkJWT)
    async updateUser(@Ctx() { payload }: MyContext, @Arg("input") input: UpdateUserInput) {  
      const user = await User.findOne({ where: { email: payload?.email } });
      if (!user) throw new Error("User not authorized!");
      if (input.email.length === 0) throw new Error("Email can't be empty!");
      Object.assign(user, input);
      await user.save();
      return user;
  }

  // Delete the current user, the one that is logged in, return true if have success
  @Mutation(() => Boolean)
  @UseMiddleware(checkJWT)
  async deleteUser(@Ctx() { payload }: MyContext) {  
    const user = await User.findOne({ where: { email: payload?.email } });
    if (!user) throw new Error("User not authorized!");
    await user.remove();
    return true;
  }

  // Login an existent user, this will give you a token to use in the headers
  @Mutation(() => LoginResponse)
  async login(@Arg("input") input: LoginUserInput) {
    const user = await User.findOne({ where: { email:input.email } });
    if (!user) {
      throw new Error("Could not find user");
    }
    const verify = await compare(input.password, user.password);
    if (!verify) {
      throw new Error("Bad password");
    }
    return {
      accessToken: sign({ name: user.name, email: user.email }, CONFIG.SECRET_KEY, {expiresIn: CONFIG.EXPIRES_IN})
    };
  }
}