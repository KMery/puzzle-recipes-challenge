import { InputType, Field } from 'type-graphql';


@InputType()
export class CreateRecipeInput {
  @Field()
    name!: string;

  @Field()
    description!: string;

  @Field(type => String)
    ingredients!: string;

  @Field({nullable: true})
    categoryId!: string;
}