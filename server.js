var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
const { argsToArgsConfig } = require('graphql/type/definition');
 
var schema = buildSchema(`
    input CourseInput {
      id: Int!
      title: String
      author: String
      description: String
      topic: String
      url: String
    }

    type Query {
        course(id: Int!): Course
        courseContains(title: String): [Course]
        courses(topic: String): [Course]
    },
    type Mutation {
        updateCourseTopic(id: Int!, topic: String!): Course
        addCourse(input: CourseInput) : [Course]
    }
    type Course {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    }
`);

var coursesData = [
    {
        id: 1,
        title: 'The Complete Node.js Developer Course',
        author: 'Andrew Mead, Rob Percival',
        description: 'Learn Node.js by building real-world applications with Node, Expresso, MangoesDB, MochaLatte, and more!',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs/'
    },
    {
        id: 2,
        title: 'Node.js, Expresso & MangoesDB Dev to Deployment',
        author: 'Brad Traversy',
        description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
    },
    {
        id: 3,
        title: 'JavaScript: Understanding The Weird Parts',
        author: 'Anthony Alicea',
        description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
        topic: 'JavaScript',
        url: 'https://codingthesmartway.com/courses/understand-javascript/'
    }
]

var getCourse = function(args) { 
  if(args.id) {  
  var id = args.id;

    return coursesData.filter(course => {
        return course.id == id;
    })[0];
  } else if (args.title) {
    var title = args.title;

    return coursesData.filter(course => course.title.includes(title));
  }
}

var getCourses = function(args) {
    if (args.topic) {
        var topic = args.topic;
        return coursesData.filter(course => course.topic === topic);
    } else {
        return coursesData;
    }
}

var updateCourseTopic = function({id, topic}) {
  coursesData.map(course => {
      if (course.id === id) {
          course.topic = topic;
          return course;
      }
  });
  return coursesData.filter(course => course.id === id) [0];
}

var addCourse = function({input}) {
  if(coursesData.push(input))
    return coursesData;
}

var root = {
  course: getCourse,
  courseContains: getCourse,
  courses: getCourses,
  addCourse: addCourse,
  updateCourseTopic: updateCourseTopic
};

var app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL server deployed on https://localhost:4000/graphql'));