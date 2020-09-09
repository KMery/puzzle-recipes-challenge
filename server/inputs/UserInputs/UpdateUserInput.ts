import { InputType, Field } from "type-graphql";
import { Length, IsNotEmpty, IsEmail } from "class-validator";

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  name!: string;

  @Field({ nullable: false })
  // @IsNotEmpty({ message: "email can't be empty" })
  @Length(20, 80)
  @IsEmail()
  email!: string;

  @Field({ nullable: true })
  @Length(8, 80)
  password!: string;
}