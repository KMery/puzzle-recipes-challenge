import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

import { Recipe } from './Recipe';

@Entity()
@ObjectType({ description: "The Categories model" })
export class Category extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: string;

    @Field()
    @Column({
        type: 'varchar',
        nullable: false,
        length: 20
    })
    name!: string;
    
    @Field(() => Date)
    @Column(() => Date)
    @CreateDateColumn()
    createdAt!: Date;

    @Field(() => Date)
    @Column(() => Date)
    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(type => Recipe, recipe => recipe.category, { cascade: true })
    recipes!: Recipe[];
}