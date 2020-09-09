import { InputType, Field } from "type-graphql";

@InputType()
export class UpdateCategoryInput {
  @Field({ nullable: true })
  name!: string;
}