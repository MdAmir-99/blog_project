const authorModel = require("../models/authorModels")
const validator = require('validator')
const jwt = require('jsonwebtoken')



//<-----------This is used for Validation of Attributes-------------------->//

let valid = function (value) {
    if (typeof value == "undefined" || typeof value == null|| typeof value === "number" || value.trim().length == 0 )
    { 
        return false 
    }
    if( typeof value == "string" ){
        return  true
    }
    return true
}



//<------------------This function is used for Creating an Author----------------->//

const createAuthor = async function (req, res) {
    try{
    let author = req.body 

    //<------Checking Whether Request Body is empty or not----------->//
    if( !(author.fname && author.lname && author.password && author.emailId) ){
        return res.status(400).send({status : false, msg : "All fields are mandatory."})
     }

    //<-------Validation of First Name----------->//
    if(!valid(author.fname)) return res.status(400).send({ status: false, message: "Please Use Alphabets in first name" })
    let name=/^[A-Za-z]+$/.test(author.fname.trim())
    if(!name) return res.status(400).send({status : false, msg : "Please Use Alphabets in first name"})

    //<-------Validation of Last Name----------->//
    if (!valid(author.lname)) return res.status(400).send({ status: false, message: "Please Use Alphabets in last name"})
    name=/^[A-Za-z]+$/.test(author.lname)
    if(!name) return res.send({ status: false, message: "Please Use Alphabets in last name"  })
    
    //<-------Validation of Title----------->//
    name = /^Mr|Mrs|Miss+$/.test(author.title)
    if(!name) return res.status(400).send({status : false, msg : "Please Use Valid Title."})

    
    //<-------Validation of Email Id----------->//
    let email = req.body.emailId
    let emailValidate = validator.isEmail(email);
    let duplicate = await authorModel.findOne({emailId : email})
    if(duplicate) return res.status(400).send({status: false, msg : "Email Already Exist."}) 
    if(!emailValidate) return res.status(404).send({ status: false, msg :"Incorrect Email!"})
  
    //<-------Author Creation----------->//
    let authorCreated = await authorModel.create(author)
    res.status(201).send({ status : true ,Data: authorCreated })

    }catch(err){
        return res.status(500).send({ msg: err.message})
    }
}

module.exports.createAuthor = createAuthor


//<---------------This function is used for Logging an Author----------------->//
const authorLogin = async function (req, res) {
    let userName = req.body.emailId;
    let Password = req.body.password;

    let user = await authorModel.findOne({ emailId: userName, password: Password }).select({ _id:1});
    if (!user)
      return res.status(404).send({
        status: false,
        msg: "Email or the password is not corerct",
      });
  
    let token = jwt.sign(
      {
        userId: user._id,
        batch: "Radon",
        project: "blog",
      },
      "room13");

      res.setHeader("x-api-key", token) 
      res.setHeader("authorId", user._id);

     return res.status(200).send({ status: true, AuthorId : user._id , token: token });
  };

module.exports.authorLogin = authorLogin