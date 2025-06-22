/*
This parte of the code represents the initial setup and configuration phase of a Node.js web application 
that will use Express.js as the web framework and MongoDB as the database.
The first line `require('dotenv').config()` loads the dotenv package and immediately calls its `config()` method.
This is a common pattern for handling environment variables in Node.js applications.
The dotenv package reads a `.env` file from your project root and loads any key - value pairs into`process.env`.
This allows you to keep sensitive information like database passwords, API keys, and configuration settings 
out of your source code.It's a security best practice that also makes your application more flexible across different 
environments (development, staging, production).
The next lines import the essential dependencies for this application. 
`express` is a minimal and flexible web framework that provides robust features for building web applications and APIs. 
`mongoose` is an Object Document Mapper(ODM) library for MongoDB and Node.js - it provides a schema - 
based solution to model your application data and includes built -in type casting, validation, 
and query building features.
The line `const app = express()` creates an Express application instance.Think of this as creating your 
web server object that you'll configure with routes, middleware, and other settings. 
This `app` object is what you'll use throughout your application to define how it responds to different HTTP requests.Finally, 
`const PORT = 3000` demonstrates a common deployment pattern.
One thing to note is the consistent formatting with aligned variable declarations - while this isn't functionally necessary, 
it shows attention to code readability and maintainability.
*/
require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const app      = express();
const PORT     = 3000;
/*
This code block handles the database connection setup for your Node.js application using Mongoose to connect to a MongoDB database.
The `mongoose.connect()` method establishes a connection to your MongoDB database.The first parameter is the connection 
string`'mongodb://localhost:27017/mydatabase'`, which specifies that you're connecting to a MongoDB instance running locally 
on your machine (localhost) on port 27017 (MongoDB's default port). T
he database name is "mydatabase" - if this database doesn't exist, MongoDB will create it automatically when you first write data to it.
The second parameter is an options object containing `useNewUrlParser: true` and`useUnifiedTopology: true`.
These are important configuration flags that tell Mongoose to use MongoDB's newer connection management systems. 
The `useNewUrlParser` option enables the new URL string parser, which handles connection strings more reliably. 
The `useUnifiedTopology` option enables the new Server Discover and Monitoring engine, which provides better connection 
handling and automatic failover support. While these options were required in older versions of Mongoose to avoid deprecation warnings, 
they're now the default behavior in newer versions. The connection method returns a Promise, which is why you see the `.then()` and `.catch()` chain.
This is asynchronous code - the database connection attempt happens in the background while your application continues to start up.
If the connection succeeds, the`.then()` block executes and logs "MongoDB connected" to the console, giving you visual confirmation 
that your database is ready.If something goes wrong(like MongoDB not running, incorrect credentials, or network issues), 
the`.catch()` block captures the error and logs it with a descriptive message.
This pattern is crucial for debugging because database connection issues are one of the most common problems in Node.js applications.
Without proper error handling, your application might fail silently or crash unexpectedly.
The error logging helps you quickly identify and resolve connection problems during development and deployment.
*/
mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser    : true,
  useUnifiedTopology : true
}).then(()   => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
/*
  This code block defines a Mongoose schema, which serves as a blueprint for documents that will be stored in your MongoDB database.
  Think of a schema as a template that describes the structure and data types of the documents in a specific collection - similar 
  to how a table schema works in relational databases, but with the flexibility that NoSQL databases provide.
  The new mongoose.Schema() constructor creates a new schema object with the field definitions you specify.
  In this case, we are defining a user schema with three fields: name, email, and age. 
  Each field is mapped to a specific data type that Mongoose will enforce when you create or update documents.
  The schema defines three simple fields with basic data types.
  The name field is set to String, which means it will store text data like "John Doe".The email field is also a String type, 
  intended for email addresses like "user@example.com".
  The age field uses the Number type, which can store both integers and floating - point numbers, making it suitable 
  for storing someone's age as a whole number.
  One important thing to understand is that this schema provides both structure and validation.
  When you later create documents based on this schema, Mongoose will automatically validate that the data types match what you've defined. 
  For example, if you try to save a user with an age of "twenty-five" (a string) instead of 25 (a number), Mongoose will throw a validation error. 
  This helps maintain data integrity and catches common programming mistakes early.
  The schema is just a definition at this point - you'll need to create a model from this schema using mongoose.model() to actually interact 
  with the database. The consistent formatting with aligned colons shows good coding practices for readability, making it easy to scan the 
  field definitions at a glance.
*/
const userSchema = new mongoose.Schema({
  name  : String,
  email : String,
  age   : Number
});
/*
This line of code creates a Mongoose model, which is the bridge between your schema definition and the actual MongoDB database operations.
The `mongoose.model()` function takes your previously defined `userSchema` and transforms it into a working model that you can use to create, 
read, update, and delete documents in your MongoDB database.
The first parameter `'User'` is the model name, which serves two important purposes.
First, it becomes the name you'll use to reference this model throughout your application. 
Second, Mongoose automatically uses this name to determine the collection name in MongoDB - it will pluralize "User" to create a collection called "users" 
(following MongoDB's naming conventions). If you want to override this behavior, you can specify a custom collection name as a third parameter.
The second parameter `userSchema` is the schema object you defined earlier, which contains the field definitions and data types.
By connecting the schema to a model, you're telling Mongoose exactly what structure and validation rules to apply when working 
with documents in the "users" collection.
The resulting `User` model is essentially a constructor function that gives you access to all of Mongoose's database operations. 
You can now use methods like `User.create()`, `User.find()`, `User.findById()`, `User.updateOne()`, and `User.deleteOne()` 
to interact with your MongoDB database. 
Each document you create through this model will automatically follow the structure defined in your schema and benefit from 
Mongoose's built -in validation.
This pattern of schema → model → database operations is fundamental to how Mongoose works and provides a clean, object - oriented 
way to interact with MongoDB while maintaining data consistency and type safety.
*/
const User = mongoose.model('User', userSchema);
/*
This code defines an Express.js route handler that retrieves a specific user by their ID from your MongoDB database.It's a GET 
endpoint that follows RESTful API conventions for fetching individual resources.
The route definition app.get('/users/:id', async (req, res) => { creates an endpoint that responds to GET requests at the path /users/:id.
The :id is a route parameter that captures whatever value is provided in that position of the URL.For example, 
if someone makes a request to /users/507f1f77bcf86cd799439011, the value 507f1f77bcf86cd799439011 becomes accessible as the id parameter.
The async keyword indicates this is an asynchronous function, which is necessary because database operations take time to complete.
The line const { id } = req.params; uses destructuring assignment to extract the id value from the request parameters object.
This is a clean way to get the specific parameter you need from the URL.The req.params object contains all the route parameters 
defined in the URL pattern.
The console.log('Fetching user with ID:', id); statement provides debugging information by logging the ID being requested.
This is helpful during development to track which user requests are being made and can be useful for troubleshooting issues.
The validation check if (!mongoose.Types.ObjectId.isValid(id)) is a crucial security and error - handling measure.
MongoDB uses ObjectIds as unique identifiers for documents, and these have a specific format(24 - character hexadecimal string).
This validation ensures that the provided ID matches MongoDB's ObjectId format before attempting any database operations. 
If the ID format is invalid, the function immediately returns a 400 Bad Request status with an error message, 
preventing potential database errors or security issues. This early validation is a best practice that saves unnecessary database 
queries and provides clear feedback to API consumers about malformed requests.
*/
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  console.log('Fetching user with ID:', id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }
/*
This code implements the core database query logic and error handling for the user retrieval endpoint, 
wrapped in a try-catch block to handle any potential errors that might occur during the database operation.
The `try` block contains the main database query using `await User.findOne({ _id: id, age: { $gt: 21 } })`. 
This Mongoose method searches for a single document that matches the specified criteria. The query object has two conditions: `_id: id` 
finds the user with the specific ID from the URL parameter, and `age: { $gt: 21 }` adds an additional filter using MongoDB's `$gt` 
(greater than) operator to only return users who are older than 21. This demonstrates how you can combine multiple criteria 
in a single query - the user must both exist with that ID and meet the age requirement.
The `if (!user)` check handles the case where no document matches the query criteria. 
This could happen if the user ID doesn't exist in the database, or if a user exists but is 21 years old or younger. 
In either case, the function returns a 404 Not Found status with a descriptive error message. This is good API design 
because it provides meaningful feedback to the client about why the request failed.
If a user is found and meets all criteria, `res.json(user)` sends the user document back to the client as a JSON response. 
Mongoose automatically converts the MongoDB document into a JSON-serializable format, including all the fields defined in your schema.
The `catch` block handles any unexpected errors that might occur during the database operation, such as database connection issues, 
malformed queries, or other technical problems. It logs the actual error to the console for debugging purposes while sending a generic 
"Internal server error" message to the client. This approach protects sensitive system information from being exposed to API consumers 
while still providing developers with the details needed for troubleshooting. 
The 500 status code indicates a server-side error, which is the appropriate HTTP response for unexpected technical failures.
*/
  try {
    const user = await User.findOne({ _id: id, age: { $gt: 21 } });
    if (!user) {
      return res.status(404).json({ error: 'User not found or underage' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
/*
This code starts your Express.js web server and makes it listen for incoming HTTP requests on the specified port. 
The `app.listen()` method is what actually launches your server and begins accepting connections from clients.
The first parameter `PORT` refers to the port number that was defined earlier in your application. 
This tells the server which network port to bind to - think of it as the "address" where your server will be reachable. 
When someone makes a request to `http://localhost:3000`, the server will receive and process that request.
The second parameter is a callback function that executes once the server successfully starts listening. 
This callback uses template literal syntax (backticks and `${}`) to log a confirmation message to the console. 
The message will display something like "Server running on port 3000", providing immediate feedback that your server 
has started successfully and showing which port it's using.
This logging is particularly useful during development because it gives you visual confirmation that your server 
is ready to accept requests. It also helps when deploying to different environments where the port might change - you'll 
always see exactly which port the server is using. The callback function is optional, but it's a common practice to include 
it for debugging and monitoring purposes.
Once this line executes successfully, your Express application is fully operational and ready to handle incoming 
HTTP requests on all the routes you've defined throughout your application.
*/
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
