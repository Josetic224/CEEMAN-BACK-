const { getUserByEmail, createUser } = require('../db/user.db');
const { badRequest, formatServerError } = require('../helpers/error');
const sendEmail = require('../utils/nodemailer');
const generateDynamicEmail = require('../utils/welcome');

const {userSchema} = require('../validations/user')

exports.signUp = async (req, res)=>{
const body = userSchema.safeParse(req.body)
if (!body.success) {
    return res.status(400).json({
      errors: body.error.issues,
    });
  }

  const {fullName, email, password, googleId} = body.data;
    try {
        let checkUser = await getUserByEmail(email)
        if(checkUser){
            return badRequest(res, "email already in use")
        }
     const newUser = await createUser(fullName, email, password, googleId);
generateDynamicEmail(fullName)

 await sendEmail({
    email:email,
    html: generateDynamicEmail(fullName),
    subject:"THANKS FOR SIGNING UP"
 })
 
return res.status(200).json({
    message:"User Signed UP successfully",
    newUser
})
       
    } catch (error) {
        return formatServerError
    }
}