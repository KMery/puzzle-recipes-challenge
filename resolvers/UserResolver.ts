import { Resolver, Query, Mutation, Arg, UseMiddleware, ObjectType, Field, Ctx } from "type-graphql";
import { hash, compare } from "bcrypt";
import { sign } from 'jsonwebtoken';

import { User } from '../server/entities/User';
import { CreateUserInput } from "../server/inputs/UserInputs/CreateUserInput";
import { UpdateUserInput } from "../server/inputs/UserInputs/UpdateUserInput";
import { checkJWT } from "../server/middleware/checkJWT";
import { LoginUserInput } from "../server/inputs/UserInputs/LoginUserInput";
import CONFIG from '../server/config'
import { MyContext } from '../server/middleware/myContext';

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
  // @Query(() => [User!])
  // async getUsers() {
  //   return User.find()
  // }
  // @Query(() => User)
  // async getUser(@Arg("id") id: string) {
  //   return User.findOne({ where: { id } });
  // }

  @Query(() => User)
  @UseMiddleware(checkJWT)
    async getUser(@Ctx() { payload }: MyContext) {
      return await User.findOne({ where: { email: payload?.email } });
  }
 
  @Mutation(() => User)
  async singUp(@Arg("input") input: CreateUserInput) {
    const hashedPassword = await hash(input.password, 12);
    if (input.email.length === 0) throw new Error("Email can't be empty!");
    // @IsNotEmpty({ message: "email can't be empty" }) input.email
    try {
      let user = await User.findOne({where: {email: input.email} });
      if (user?.email) throw new Error("Email already in use!");
      await User.insert({name: input.name, email: input.email, password: hashedPassword});
      user = await User.findOne({where: {email: input.email}})
      // await user.save();
      return user;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Mutation(() => User)
  @UseMiddleware(checkJWT)
    async updateUser(@Ctx() { payload }: MyContext, @Arg("input") input: UpdateUserInput) {  
      const user = await User.findOne({ where: { email: payload?.email } });
      if (!user) throw new Error("User not authorized!");
      if (input.email.length === 0) throw new Error("Email can't be empty!");
      // console.log(user);
      Object.assign(user, input);
      await user.save();
      return user;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(checkJWT)
  async deleteUser(@Ctx() { payload }: MyContext) {  
    const user = await User.findOne({ where: { email: payload?.email } });
    if (!user) throw new Error("User not authorized!");
    await user.remove();
    return true;
  }
  // async updateUser(@Arg("id") id: string, @Arg("input") input: UpdateUserInput) {
  //   const user = await User.findOne({ where: { id } });
  //   if (!user) throw new Error("User not found!");
  //   console.log(user);
  //   Object.assign(user, input);
  //   await user.save();
  //   return user;
  // }

  // @Mutation(() => Boolean)
  // async deleteUser(@Arg("id") id: string) {
  //   const user = await User.findOne({ where: { id } });
  //   if (!user) throw new Error("User not found!");
  //   await user.remove();
  //   return true;
  // }
  
  // @Query(() => String)
  // @UseMiddleware(checkJWT)
  //   async token(@Ctx() { payload }: MyContext) {
  //     return `Welcome ${payload!.name}`;
  // }

  @Mutation(() => LoginResponse)
  async login(@Arg("input") input: LoginUserInput) {
    const user = await User.findOne({ where: { email:input.email } });
    if (!user) {
      throw new Error("Could not find user");
    }
    const verify = await compare(input.password, user.password);
    // console.log(verify);
    if (!verify) {
      throw new Error("Bad password");
    }
    return {
      accessToken: sign({ name: user.name, email: user.email }, CONFIG.SECRET_KEY, {expiresIn: CONFIG.EXPIRES_IN})
    };
  }
}