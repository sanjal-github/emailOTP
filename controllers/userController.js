const userModel = require("../models/user")
const userOTPVerification = require("../models/userOTPVerification");
const nodemailer = require("nodemailer");
const bcrypt = require('bcryptjs');
require("dotenv").config();
// set an option for an email using nodemailer stuff 

var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,

    auth: {
        user: "rajj.mtech@gmail.com",
        pass: "jzajywmshlpjonop",
    },
});

var userSignUp = async (req, res) => {
    try {

        const theUser = new userModel({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            dateOfBirth: req.body.dateOfBirth
        });

        const newUser = await theUser.save();
        sendOTPVerificationEmail(newUser, res);


    }
    catch (error) {
        res.json({
            status: "FAILED",
            message: error.message
        })
    }
}


//send otp verification mail 

const sendOTPVerificationEmail = async ({ _id, email }, res) => {
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        const mailOption = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Verify Your Email",
            html: `<p>Enter <b>${otp}</b> in the app to verify your email address and complete the signup
                     <p><b>This Code Expires in 1 Hours</b></p>`
        }; //mailOptions
        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(otp, saltRounds);
        const OTPVerification = new userOTPVerification({
            userId: _id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiredAt: Date.now() + 3600000,
        });
        const sendOTP = await OTPVerification.save();
        const sendMail = await transporter.sendMail(mailOption)
        res.json({
            status: "PENDING",
            message: "Verification OTP email sent",
            data: {
                userId: _id,
                email
            }
        })
    }
    catch (error) {
        console.log(error);
        res.json({
            status: "FAILED",
            message: error.message,
        })
    }
}

const verifyOTP = async (req, res) => {
    try {
        console.log("hye to all")
        let userId = req.body.userId;
        let otp = req.body.otp;
        //let { userId, otp } = req.body;
        console.log(userId, otp);
        if (!userId || !otp) {
            throw Error("Error otp details are not allowed");
        }
        else {
            const UserOTPVerificationRecords = await userOTPVerification.find({
                userId,
            });
            if (UserOTPVerificationRecords.length <= 0) {
                // no record found 
                throw new Error("Account record doesn't exist or has been verified already.....please signUp or Login In");

            }
            else {
                //user otp record exists
                const { expiresAt } = UserOTPVerificationRecords[0];
                const hashedOTP = UserOTPVerificationRecords[0].otp;
                if (expiresAt < Date.now()) {
                    //user otp record has expired 
                    await userOTPVerification.deleteMany({ userId });
                    throw new Error("Code has Expired.....please request again.");

                } // expires 
                else {
                    const validOTP = await bcrypt.compare(otp, hashedOTP);
                    if (!validOTP) {
                        throw new Error("Invalid code passed....Checked yout inbox..");
                    }
                    else {
                        await userModel.updateOne({ _id: userId }, { verified: true });
                        await userOTPVerification.deleteMany({ userId });
                        res.json({
                            status: "VERIFIED",
                            message: "user email verified successfully."
                        });
                    }

                }
            }
        }
    }
    catch (error) {
        console.log(error);
        res.json({
            status: "FAILED",
            message: error.message
        })
    }
}

module.exports = {
    userSignUp,
    verifyOTP
}