import { Resolver, Query, Mutation, Arg, UseMiddleware, Ctx } from "type-graphql";

import { Recipe } from '../server/entities/Recipe';
// import { User } from '../server/entities/User';
import { CreateRecipeInput } from "../server/inputs/RecipeInputs/CreateRecipeInput";
import { UpdateRecipeInput } from "../server/inputs/RecipeInputs/UpdateRecipeInput";
import { checkJWT } from "../server/middleware/checkJWT";
import { MyContext } from "../server/middleware/myContext";
import { User } from "../server/entities/User";
import { Category } from "../server/entities/Category";

@Resolver()
export class RecipeResolver {
  @Query(() => [Recipe])
  @UseMiddleware(checkJWT)
  async getRecipes(@Ctx() { payload }: MyContext)  {
    return await Recipe.find();
  }

  @Query(() => Recipe)
  @UseMiddleware(checkJWT)
  async getOneRecipe(@Ctx() { payload }: MyContext, @Arg("id") id: string) {
    return await Recipe.findOne({ where: { id } });
  }

  @Mutation(() => Recipe)
  @UseMiddleware(checkJWT)
  async createRecipe(@Ctx() { payload }: MyContext, @Arg("input") input: CreateRecipeInput) {
    let recipe = await Recipe.findOne({where: { name: input.name }});
    if (recipe) throw new Error("Recipe already exists!");
    const user = await User.findOne({where: {email: payload?.email}});
    recipe = Recipe.create(input);
    // await Recipe.insert({userId: user?.id})
    Object.assign(recipe, {userId: user?.id});

    if (input.categoryId) {
      const category = await Category.findOne({where: {id: input.categoryId}}) 
      Object.assign(recipe, {categoryId: category?.id});
    } else {
      throw new Error("Recipe category doesn't exist!");
    }
    // await User.insert({name: input.name, email: input.email, password: hashedPassword});
    // console.log(recipe);
    await recipe.save(); 
    return recipe;
  }

  @Mutation(() => Recipe)
  @UseMiddleware(checkJWT)
  async updateRecipe(@Ctx() { payload }: MyContext, @Arg("id") id: string, @Arg("input") input: UpdateRecipeInput) {
    const recipe = await Recipe.findOne({ where: { id } });
    if (!recipe) throw new Error("Recipe not found!");
    Object.assign(recipe, input);
    await recipe.save();
    return recipe;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(checkJWT)
  async deleteRecipe(@Ctx() { payload }: MyContext, @Arg("id") id: string) {
    const recipe = await Recipe.findOne({ where: { id } });
    if (!recipe) throw new Error("Recipe not found!");
    await recipe.remove();
    return true;
  }

  @Query(() => [Recipe!])
  @UseMiddleware(checkJWT)
  async getMyRecipes(@Ctx() { payload }: MyContext) {
    const user = await User.findOne({where: { email: payload?.email }})
    return await Recipe.find({where: { userId: user?.id }});
  }
  
}