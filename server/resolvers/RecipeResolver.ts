import { Resolver, Query, Mutation, Arg, UseMiddleware, Ctx } from "type-graphql";

import { Recipe } from '../entities/Recipe';
import { CreateRecipeInput } from "../inputs/RecipeInputs/CreateRecipeInput";
import { UpdateRecipeInput } from "../inputs/RecipeInputs/UpdateRecipeInput";
import { checkJWT } from "../middleware/checkJWT";
import { MyContext } from "../middleware/myContext";
import { User } from "../entities/User";
import { Category } from "../entities/Category";

//You need to singUp an user and login to use this resolver, more information in UserResolver
@Resolver()
export class RecipeResolver {
  //This Query let you get all the recipes
  @Query(() => [Recipe])
  @UseMiddleware(checkJWT)
  async getRecipes(@Ctx() { payload }: MyContext)  {
    return await Recipe.find();
  }

  //This Query get one recipe from the given id
  @Query(() => Recipe)
  @UseMiddleware(checkJWT)
  async getOneRecipe(@Ctx() { payload }: MyContext, @Arg("id") id: string) {
    return await Recipe.findOne({ where: { id } });
  }

  //This mutation is for create a new recipe
  @Mutation(() => Recipe)
  @UseMiddleware(checkJWT)
  async createRecipe(@Ctx() { payload }: MyContext, @Arg("input") input: CreateRecipeInput) {
    let recipe = await Recipe.findOne({where: { name: input.name }});
    if (recipe) throw new Error("Recipe already exists!");
    const user = await User.findOne({where: {email: payload?.email}});
    recipe = Recipe.create(input);
    Object.assign(recipe, {userId: user?.id});
    if (input.categoryId) {
      const category = await Category.findOne({where: {id: input.categoryId}}) 
      Object.assign(recipe, {categoryId: category?.id});
    } else {
      throw new Error("Recipe category doesn't exist!");
    }
    await recipe.save(); 
    return recipe;
  }

  //This mutation is for update an existent recipe, you must give the id and the data input for the update
  @Mutation(() => Recipe)
  @UseMiddleware(checkJWT)
  async updateRecipe(@Ctx() { payload }: MyContext, @Arg("id") id: string, @Arg("input") input: UpdateRecipeInput) {
    const recipe = await Recipe.findOne({ where: { id } });
    if (!recipe) throw new Error("Recipe not found!");
    Object.assign(recipe, input);
    await recipe.save();
    return recipe;
  }

  //This delete an recipe for the give id, if you create it
  @Mutation(() => Boolean)
  @UseMiddleware(checkJWT)
  async deleteRecipe(@Ctx() { payload }: MyContext, @Arg("id") id: string) {
    const user = await User.findOne({ where: { email: payload?.email } })
    const recipe = await Recipe.findOne({ where: { id } });
    if (recipe?.userId !== user?.id) throw new Error("User not authorized to delete recipe!");
    if (!recipe) throw new Error("Recipe not found!");
    await recipe.remove();
    return true;
  }

  //Get the recipes that you have created
  @Query(() => [Recipe!])
  @UseMiddleware(checkJWT)
  async getMyRecipes(@Ctx() { payload }: MyContext) {
    const user = await User.findOne({where: { email: payload?.email }})
    return await Recipe.find({where: { userId: user?.id }});
  }
}