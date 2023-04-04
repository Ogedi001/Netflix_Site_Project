const mongoose =require('mongoose')
const {isEmail}= require('validator'),
bcrypt = require('bcrypt')

const personSchema = new mongoose.Schema({
fullname:{
    type:String,
    required:[true,'name is required']
    
},
email:{
    type:String,
    required:[true,'email is required'],
    unique:true,
    validate:[isEmail,"you must enter a valid email"]
},
password:{
    type:String,
    required:[true,'password is required'],
    minLength:[8,'your password must be 8 character'],
    maxLength:[15,'your password must not exceed 15 characters']

},
imageUrl:{
type:String
}
})

personSchema.pre('save', async function(next) {
    try {
      this.email= this.email.toLowerCase()
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
      next();
    } catch (error) {
      next(error);
    }
  });
  

  //mongoose method for login , returns a user (true) or error (false)
  personSchema.statics.UserAuth = function(email, password) {
    return new Promise(async (resolve, reject) => {
  
      try {
        if (!email) {
          reject("Please insert a valid email");
          return;
        }
  
        if (!password) {
          reject("Please insert a valid password");
          return;
        }
  
        // search for any user with that email
        const user = await this.findOne({ email });
  
        if (!user) {
          reject("User does not exist!");
          return;
        }
  
        // compare password
        const hasValidPass = bcrypt.compareSync(password, user.password);
  
        if (!hasValidPass) {
          reject("Invalid credentials");
          return;
        }
  
        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  };
  
  
const Person = mongoose.model('Person',personSchema)
module.exports = Person