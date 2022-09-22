
const fs = require('fs');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

const GraphQLDate = new GraphQLScalarType({
	  name: 'GraphQLDate',
	  description: 'A Date() type in GraphQL as a scalar',
	  serialize(value) {
		      return value.toISOString();
		    },
	  parseValue(value) {
		      return new Date(value);
		    },
	  parseLiteral(ast) {
		      return (ast.kind == Kind.STRING) ? new Date(ast.value) : undefined;
		    },
});


const issuesDB = [
	  {
		  id: 1, status: 'New', owner: [{name: 'Ravan', age:30}, {name: 'Eddie', age: 35}], effort: 5,
		      created: new Date('2019-01-15'), due: undefined,
		      title: 'Error in console when clicking Add',
		    },
	  {
		  id: 2, status: 'Assigned', owner: [{name: 'Eddie', age: 35}, {name: 'Ravan', age:30}], effort: 14,
		      created: new Date('2019-01-16'), due: new Date('2019-02-01'),
		      title: 'Missing bottom border on panel',
		    },
];

const resolvers = {

	Query:{
		issueList, 
	},
	Mutation:{
		issueAdd,
	}
};

function issueList(_, {id})
{
	if(id == null) return issuesDB;
	else return [issuesDB[id-1]];
}

function issueAdd(_, {newissue})
{
newissue.created = new Date();
newissue.id = issueDB.length + 1;
newissue.status = 'New';
issueDB.push(newissue);
return issueDB[issueDB.length-1];
}


const server = new ApolloServer({
	  typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
	  resolvers,
});


const app = express();
app.use(express.static('public'));

server.applyMiddleware({ app, path: '/graphql' });

app.listen(3000, function () {
  console.log('App started on port 3000');
});
