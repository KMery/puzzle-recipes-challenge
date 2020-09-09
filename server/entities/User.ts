import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany  } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { Length, IsNotEmpty, IsEmail } from "class-validator";

import { Recipe } from './Recipe';

@Entity()
@ObjectType({ description: "The Users model" })
export class User extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: string;

    @Field(() => String)
    @Column({
        type: 'varchar',
        nullable: false
    })
    @IsNotEmpty()
    @Length(4, 20)
    name!: string;    

    @Field(() => String)
    @Column({
        type: 'varchar',
        nullable: false
    })
    @IsNotEmpty({ message: "email can't be empty" })
    @Length(20, 80)
    @IsEmail()
    email!: string;

    @Column({
        type: 'varchar',
        nullable: false
    })
    @IsNotEmpty()
    @Length(8, 80)
    password!: string;

    @Field(() => Date)
    @Column()
    @CreateDateColumn()
    createdAt!: Date;

    @Field(() => Date)
    @Column()
    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(type => Recipe, recipe => recipe.user, { cascade: true })
    recipes!: Recipe[];
}

