const express = require("express");
const cors = require("cors");
const socket = require("socket.io");
const color = require("colors");
const app = express();
const db = require('./db');
const bcrypt = require('bcrypt');
const { joinUser, getCurrentUser, userDisconnects } = require("./testChat");
const bodyParser = require("body-parser");

const port = 8000;
app.use(express());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

async function hashPassword(password) {
   const salt = await bcrypt.genSalt(6);
   const hashed = await bcrypt.hash(password, salt);
   return hashed;
}

var server = app.listen(
   port,
   console.log(
      `server running on port ${(port)}`.green
   )
);

app.post('/login', (req, res) => {
   var username = req.body.username;
   var password = req.body.password;
   //check to see if online
   db.query(`SELECT id FROM users WHERE username = ? AND password = ?`,
      [username, password],
      (err, result) => {
         if (err) {
            console.log(err)
            return console.error(err.message);
         } else if (result.length > 0) {
            res.json({ token: result });
         } else {
            res.json("incorrect username or password")
         }
         res.end();
      });

   //set user online
   setStatusOnline(username, password);
});

app.post('/getProfileInfo', (req, res) => {
   var id = req.body.id;
   //get profile info query
   db.query(`SELECT id, name, email  FROM userprofile WHERE id = ?`,
      [id],
      (err, result) => {
         if (err) {
            console.log(err)
            return console.error(err.message);
         } else if (result.length > 0) {
            var info = (JSON.stringify(result[0]));
            res.send(info);
         } else {
            console.log(result);
            res.json("incorrect username or password")
         }
         res.end();
      });
});

app.post('/newUser', (req, res) => {
   var username = req.body.username;
   var password = req.body.password;
   var email = req.body.email;

   //insert a new user into user table
   db.query(`INSERT INTO users(username, password) VALUES (?,?);`,
      [username, password],
      (err, result) => {
         if (err) {
            console.log(err)
            return console.error(err.message);
         } else {
            var returnid = (result.insertId);
            console.log(returnid);
            db.query(`INSERT INTO userprofile(id, email) VALUES (?, ?);`,
               [returnid, email],
               (err, result) => {
                  if (err) {
                     console.log(err)
                     return console.error(err.message);
                  } else {
                     //var info = (JSON.stringify(result[0]));
                     res.send(result);
                  }
               });
         }
      });
});

app.post('/getUserChatrooms', (req, res) => {
   var id = req.body.id[0].id;
   //get profile info query
   db.query(`SELECT chatroomid FROM userchatrooms WHERE userid = ?`,
      [id],
      (err, result) => {
         if (err) {
            console.log(err)
            return console.error(err.message);
         } else if (result.length > 0) {
            var info = (JSON.stringify(result));
            res.send(info);
         } else {
            console.log(result);
            res.json("incorrect username or password")
         }
         res.end();
      });
});

app.post('/createchatroom', (req, res) => {
   var user1id = req.body.user1id.user1;
   var user2id = req.body.user2id.user2;
   console.log(user1id[0].id);
   console.log(user2id);

   db.query(`INSERT INTO chatrooms (size) VALUES (2);`,
      [],
      (err, result) => {
         if (err) {
            console.log(err);
         } else {
            var returnid = (result.insertId);
            db.query(`INSERT INTO userchatrooms (userid, chatroomid) VALUES (?, ?);
                      INSERT INTO userchatrooms (userid, chatroomid) VALUES (?, ?);`,
               [user1id[0].id, returnid, user2id, returnid],
               (err, result) => {
                  if (err) {
                     console.log(err);
                  } else {
                     res.json(returnid);
                     console.log("test: " + returnid);
                  }
                 
               });
         }
      });
});

app.post('/getAllProfiles', (req, res) => {
   //get profile info query
   db.query(`SELECT id, name FROM userprofile`,
      [],
      (err, result) => {
         if (err) {
            console.log(err)
            return console.error(err.message);
         } else if (result.length > 0) {
            var info = (JSON.stringify(result));
            res.send(info);
         } else {
            console.log(result);
            res.json("incorrect username or password")
         }
         res.end();
      });
});

app.post('/updateProfile', (req, res) => {
   var id = req.body.userid;
   var name = req.body.name;
   console.log(name);
   var email = req.body.email;
   var password = req.body.password;
   //get profile info query
   db.query(`UPDATE userprofile SET name = ?, email = ? WHERE id = ?`,
      [name, email, id],
      (err, result) => {
         if (err) {
            console.log(err)
            return console.error(err.message);
         } else if (result.length > 0) {
            var info = (JSON.stringify(result[0]));
            res.send(info);
         } else {
            console.log(result);
         }
         res.end();
      });
});

app.post('/logout', (req, res) => {
   var username = req.body.user;
   console.log(username);
   setStatusOffline(username);
   console.log("hit logout");
});

function setStatusOnline(username) {
   db.query(`UPDATE users SET status = 'online' WHERE username = ?`,
      [username],
      (err, result) => {
         if (err) {
            console.log(err)
            return console.error(err.message);
         }
      });
}
function setStatusOffline(username) {
   db.query(`UPDATE users SET status = 'offline' WHERE username = ?`,
      [username],
      (err, result) => {
         if (err) {
            console.log(err)
            return console.error(err.message);
         }
      });
}

app.post('setStatusOnline', (req, res) => {

})


app.use('/checkchatroomexists', (req, res) => {
   var user1id = req.body.user1id.user1;
   var user2id = req.body.user2id.user2;
   console.log(user1id[0].id);
   console.log(user2id);

   db.query(`SELECT u1.chatroomid FROM userchatrooms u1 
             JOIN userchatrooms u2 ON u1.chatroomid = u2.chatroomid 
             WHERE u1.userid = ? AND u2.userid = ? 
             AND u1.userid <> u2.userid;`,
      [user1id[0].id, user2id],
      (err, result) => {
         if (err) {
            console.log(err);
         }
         res.send(JSON.parse(JSON.stringify(result)));
         console.log(result);
      });
});


const io = socket(server);

io.on("connection", (socket) => {

   socket.on("joinRoom", ({ username, roomname }) => {
      const p_user = joinUser(socket.id, username, roomname);
      console.log(socket.id, "= id");
      socket.join(p_user.roomNum);

      socket.emit("message", {
         userId: p_user.userId,
         username: p_user.username,
         text: `Welcome ${p_user.username}`,
      });

      socket.broadcast.to(p_user.roomNum).emit("message", {
         userId: p_user.userId,
         username: p_user.username,
         text: `${p_user.username} has joined the chat`,
      });
   });

   socket.on("chat", (req) => {
      const userinfo = req;
       
      if (userinfo) {
         console.log("chat hit");
         console.log(userinfo);
         io.in(userinfo.room).emit("message", {
            userId: userinfo.id,
            room: userinfo.room,
            text: userinfo.messageEncrypted
         });
      }
      // const p_user = getCurrentUser(socket.id);
      // if (p_user) {
      //    console.log("chat hit");
      //    io.in(p_user.roomNum).emit("message", {
      //       userId: p_user.userId,
      //       username: p_user.username,
      //       text: text,
      //    });
      // }
   });

   socket.on("disconnect", () => {
      console.log("disconnected1");

      var p_user = userDisconnects(socket.id);
      //p_user = getCurrentUser(socket.id);

      if (p_user) {
         console.log("disconnected");
         io.in(p_user.roomNum).emit("message", {
            userId: p_user.userId,
            username: p_user.username,
            text: `${p_user.username} has left the room`,
         });
      }
   });


});
