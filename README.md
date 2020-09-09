# Puzzle: RECIPE CHALLENGE
This is an backend nodeJS + type-graphql API to register recipes in a mysql database

## Libraries
This project was made using the following libraries
    
    ● Graphql
    ● TypeOrm
    ● Apollo
    ● JWT
    ● bycript
    ● MySql


## Installation

Once you have clone this project go to that folder in command line with "cd folder"
Then you can test it with:

####    npm run start

You must have the mysql database ON and you can configure it in "ormconfig.json" or just set as in the file.
The sentence for create the database is: CREATE DATABASE [IF NOT EXISTS] puzzle

Once you have all this steps running you can go to http://localhost:4000/ and create an new user with the createUser mutation:

    mutation newUser {
        createUser(input: {
            name: "your_name",
            email: "your_email@email.com"
            password: "your_password"
        }) {
            id
            name
            email
            createdAt
            updatedAt
        }
    }

and the just login to use the other queries and mutations

    mutation loginUser {
        login(input: {
            email: "your_email@email.com",
            password: "your_password"
        }) {
            accessToken
        }
    }

Copy the accessToken and paste it in the HTTP header of the playground, like this:

{
    "Authorization": "Bearer 'your_accessToken_here'"
}

Now you can use the other mutations and queries

## Mutations and Queries
You can use the following

    Queries:
        getUser
        getOneCategory
        getCategories
        getOneRecipe
        getRecipes
        getMyRecipes

    Mutations:
        singUp
        login
        createUser
        createCategory
        createRecipe
        updateUser
        updateCategory
        updateRecipe
        deleteUser
        deleteCategory
        deleteRecipe    

For more information about this you can check the DOCS button in the playground (in http://localhost:4000/)

## Author
Mayra Leiva 09/2020