const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require('express');
const app = express();
const path=require("path");
const methodOverride=require("method-override");

app.use(methodOverride('_method'));
app.use(express.urlencoded({extende:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
// let  createRandomUser=()=>{
//     return {
//       userId: faker.string.uuid(),
//       username: faker.internet.userName(),
//       email: faker.internet.email(),
//       avatar: faker.image.avatar(),
//       password: faker.internet.password(),
//       birthdate: faker.date.birthdate(),
//       registeredAt: faker.date.past(),
//     };
//   }
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password:'1029',
});

// let q="show tables"
// inserting new data
// let q="insert into user (id,username,email,password) values(? ,? ,? ,?);"; //For single data
// let user=["123","123_newuser","adc@gmail.com","abc"];
// let  createRandomUser=()=>{
//     return {
//       id: faker.datatype.uuid(),
//       username: faker.internet.userName(),
//       email: faker.internet.email(),
//       password: faker.internet.password(),
//     };
//   }

//Insertind multiple data
let q="insert into user (id,username,email,password) values ?;";//Fro MKultiple data 
let  getRandomUser=()=>{
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
}

let data=[];
for (let i = 0; i < 100; i++) {
  // console.log(getRandomUser());
  data.push(getRandomUser());//100  fake users
  
};

// try {
//   connection.query(q,[data],(err,result)=>{
//       if (err) throw err;
//       console.log(result);
//       // console.log(result[0]);
//       // console.log(result[1]);

//   }); 
// } catch (err) {
//   console.log(err);  
// }
// connection.end();


//hoem route
app.get("/",(req,res)=>{
  let q=`select count(*) from user`;
  try {
      connection.query(q,(err,result)=>{
          if (err) throw err;
          let count=result[0]["count(*)"];
          res.render("home.ejs",{count});
      }); 
    } catch (err) {
      console.log(err);
      res.send("some error in db")  
    }
});
//show route
app.get("/user",(req,res)=>{
  let q=`select * from user;`;
  try {
    connection.query(q,(err,users)=>{
        if (err) throw err;
        // console.log(result);
        // res.send(result);
        res.render("showusers.ejs",{users});
    }); 
  } catch (err) {
    console.log(err);
    res.send("some error in db")  
  }
});
//edit route
app.get("/user/:id/edit",(req,res)=>{
    let {id}=req.params;
    let q=`select * from user where id='${id}';`
    try {
      connection.query(q,(err,result)=>{
          if (err) throw err;
          let user=result[0];
          res.render("edit.ejs",{user});
      }); 
    } catch (err) {
      console.log(err);
      res.send("some error in db")  
    }
    
});
//UPdate ()DB Route
app.patch("/user/:id",(req,res)=>{
  let {id}=req.params;
  console.log(req.body);
  let {password:formPass,username:newUsername}=req.body;
  let q=`select * from user where id='${id}';`
  try {
    connection.query(q,(err,result)=>{
        if (err) throw err;
        let user=result[0];
        if (formPass!=user.password){
          res.send("Wrong Password");
        }else{
          let q2=`update user set username='${newUsername}' where id='${id}';`
          connection.query(q2,(err,result)=>{
            if (err)throw err;
            res.redirect("/user");
          });
        }
    }); 
  } catch (err) {
    console.log(err);
    res.send("some error in db")  
  }
});


app.listen("8080",()=>{
  console.log("server is listining");
});

// try {
//   connection.query(q,[data],(err,result)=>{
//       if (err) throw err;
//       console.log(result);
//       // console.log(result[0]);
//       // console.log(result[1]);

//   }); 
// } catch (err) {
//   console.log(err);  
// }
// connection.end();