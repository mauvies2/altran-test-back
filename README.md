# ALTRAN Backend Assessment

---

A software to query data related to clients and policies from an insurance company.

## Install

Clone down this repository. You will need `node` and `npm` installed globally on your machine.  

Installation:

Head to project directory. Open the terminal or command prompt and enter the following commands:

`npm install`  

To Start Server:

`npm start`  

To Visit App:

`localhost:5000`

## App Instructions 

The app allows user registration and login. In order to grant and admin role, the user must enter "admincode" at the end of the registration form.
Once logged in, it is possible to perform the different queries requested for the test. There is also a logout button to end the session.

## Dependencies included

axios => to perform requests to the URLs <br/>
bcryptjs => to encrypt the user passwords <br/>
connect-flash => to display special messages related to sessions <br/>
cors => to enable all cors for requests <br/>
ejs => to work with html templates views <br/>
express-ejs-layouts => html layouts <br/>
express => main node.js framework implemented <br/>
express-session => to handle user sessions <br/>
mongodb => for database structure <br/>
mongodb-memory-server => in-memory mongodb database <br/>
morgan => 
passport and passport-local => for authentication <br/>

Also as a dev-dependency I used nodemon to update changes on server while running

## Development comments

I encountered some issue when deserializing user instances, since I used an in-memory implementation of the database with mongo-memory-server,
and with the passport-local method for authentication, there is a final function to match user by id from the database (findById) which is used with mongoose but 
does not work in my code. I tried several other ways to overcome this bug but I could not find a solution. However, with more time I would have migrated the database
to something like mongodb atlas and with mongoose and I'm pretty sure everythink would work. Since I do not have the user variable I could not give permissions 
to the queries performed by users (admin or user). However, everything else requested for the app (and beyond) works fine (I think so XD).
