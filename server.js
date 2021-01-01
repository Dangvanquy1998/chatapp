const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cookieParser = require('cookie-parser');

const path = require('path');

const app = express();

const server = http.createServer(app);

const io = socketio(server);


const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://root:quycntt@cluster0.cnv61.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true}, function (err) {
    if (!err) {
        console.log('Connect mongoose db ok');
    } else {
        console.log('Connect mongoose db error');
    }
});

app.use(express.static(path.join(__dirname, 'public/Resources/css')));
app.use(express.static(path.join(__dirname, 'public/Resources/js')));
app.use(express.static(path.join(__dirname, 'public/Resources/Images')));
app.use(express.static(path.join(__dirname, 'public/Resources/font')));

// moment
const moment = require('moment');

// import models
const Account = require('./models/Account');
const Message = require('./models/Message');

// Google Auth
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '391622478031-db4vurbbm546jpb0446dpgnmaodppi6f.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    let token = req.cookies['session-token'];
    
 res.render('index')
 console.log(token);
})

app.get('/login', (req, res) => {
 res.render('login');
})

app.post('/login', (req, res) => {
 const token = req.body.token;
 
 async function verify() {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  
  console.log("paymload" + payload.sub);
  // googleoauth to mongoose
  let Account1 = new Account({
      name: payload.name,
      email: payload.email,
      avatar: payload.picture,
      isPassword: 'N',
      googlePlusId: payload.sub,
      loginType: 'google'
  })
  Account
.findOne({googlePlusId : payload.sub })
.exec(function (err, accounts) {
    debugger;
  if (accounts) {
      console.log(accounts[0]);
    console.log('dang nhap')
  } else {
      console.log('chua dang nhap')
      Account1.save(function (err) {
      if (err) {
          console.log('save account google error');
      }
  })
  }

  
});
  

}
verify().then(() => {
 res.cookie('session-token', token);
 res.send('success');
}).catch(console.error);
})

app.get('/dashboard', checkAuthenticated, (req, res) => {
 let user = req.user;
 res.render('dashboard', {user});
 
})

app.get('/home', checkAuthenticated, (req, res) => {
 let user = req.user;
 res.render('home', {user});
})

app.get('/logout', checkAuthenticated, (req, res) => {
    let user = req.user;
    
 res.clearCookie('session-token');
 res.redirect('/');
})

function checkAuthenticated(req, res, next){

    let token = req.cookies['session-token'];

    let user = {};
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        user.name = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;
        user.id = payload.sub;
      }
      verify()
      .then(()=>{
          req.user = user;
          next();
      })
      .catch(err=>{
          res.redirect('/')
      })

}

let users = [];
let connnections = [];
let listMessage = [];

app.get('/chat', checkAuthenticated, (req, res) => {
    user = req.user;
    res.render('chat', {users: JSON.stringify(users), user: user});
})

app.get('/api/findAllAccounts', (req, res) => {
    var Account1 = new Account({
        name: req.params.name,
        username: req.params.username
    })

    res.json(Account);
})







// socketio
io.on('connection', socket => {
 
 socket.on('login', data => {
        let userOnline = JSON.parse(data.users);    
        let id = userOnline.id;
        socket.id = userOnline.id;
        socket.username = userOnline.name;
        socket.picture = userOnline.picture;

        console.log('socket id' + socket.id);
        
        if (!checkUserOnlineExist(id, users)) {
            users.push({id, username: socket.username, picture: socket.picture});
            updateUsernames();    
        }

 })

 //update Usernames in the client
    const updateUsernames = () => {
        io.emit('listUserOnline', {users});
    }

    const checkUserOnlineExist = (id, listUser) => {
        for(let i= 0;i<listUser.length;i++){
            if(listUser[i].id === id){
                return true; 
            }
        }

        return false;
    }

    // click user chat
    socket.on('chooseUser', data => {
        listMessage = [];
        console.log(data);
        let userCurrent = data.userCurrent;
        let userClick = data.userClick;
        Message.find({
    $or: [
        {$and: [
        {id: userCurrent.id},
        {userIdTo: userClick.id}
        ]},
        {$and: [
        {id: userClick.id},
        {userIdTo: userCurrent.id}
    ]}
    ]
    
}).exec(function(err, messsages) {
    if (messsages) {
        console.log('has messages' + messsages);
        listMessage = [];
        listMessage = messsages;
        updateMessage();
    } else {
        console.log('not has message');
    }
});
    })

    // send message
    socket.on('message', data => {
        let userSendMessage = JSON.parse(data.user);
        let userChatTo = data.userChatTo;
        console.log(data);
        let message = data.message;
        let timeSend = data.timeSend;
           
        console.log(message);
        let id = userSendMessage.id;
        socket.id = userSendMessage.id;
        socket.username = userSendMessage.name;
        socket.picture = userSendMessage.picture;

        let Message1 = new Message({
            id: id,
            username: socket.username,
            picture: socket.picture,
            message: message,
            userIdTo: userChatTo.id,
            timeSend: timeSend
        })

        listMessage.push({id, username: socket.username, picture: socket.picture, message: message, userIdTo: userChatTo.id, timeSend: timeSend});
        updateMessage();
        
        Message1.save(function(err) {
            if (err) {
                console.log('Sava message error');
            } else {
                
            }
        })
        
        
    })

    const updateMessage = () => {
        io.emit('list-message', {listMessage});
    }

 // When client left site has socket.io (khong can set event button)
 socket.on('disconnect', () => {
    if(!socket.username)
            return;
        //find the user and delete from the users list
        let user = undefined;
        for(let i= 0;i<users.length;i++){
            if(users[i].id === socket.id){
                user = users[i];
                break;
            }
        }
        users = users.filter( x => x !== user);
        //Update the users list
        updateUsernames();
        connnections.splice(connnections.indexOf(socket),1);
  io.emit('listUserOnline', {users});
  
 })
})

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));