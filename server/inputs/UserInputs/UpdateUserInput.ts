import { InputType, Field } from "type-graphql";
import { Length, IsEmail } from "class-validator";

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  name!: string;

  @Field({ nullable: false })
  @Length(20, 80)
  @IsEmail()
  email!: string;

  @Field({ nullable: true })
  @Length(8, 80)
  password!: string;
}