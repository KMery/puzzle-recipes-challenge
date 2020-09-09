import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, BaseEntity } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

import { User } from './User';
import { Category } from './Category'


@Entity()
@ObjectType({ description: "The Recipes model" })
export class Recipe extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: string;

    @Field()
    @Column({
        type: 'varchar',
        nullable: true,
        length: 50
    })
    name!: string;

    @Field()
    @Column({
        type: 'varchar',
        nullable: true,
        length: 150
    })
    description!: string;

    @Field(type => String)
    @Column({
        type: 'varchar',
        nullable: true,
        length: 250
    })
    ingredients!: string;

    @Field(() => Date)
    @Column()
    @CreateDateColumn()
    createdAt!: Date;

    @Field(() => Date)
    @Column()
    @UpdateDateColumn()
    updatedAt!: Date;

    @Field(() => String)
    @Column()
    userId: string;

    @ManyToOne(type => User, user => user.recipes)
    @JoinColumn({
        name: "userId"
    })
    user!: string;
    
    @Field(() => String)
    @Column()
    categoryId: string;
    
    @ManyToOne(type => Category, category => category.recipes)
    @JoinColumn({
        name: "categoryId"
    })
    category!: string
}