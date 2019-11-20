import express from "express";
import verify from "../../server/verify";
import userCtrl from "./user.controller";
const router = express.Router();
// User Model
/**
* @swagger
* definitions:
*  User:
*    type: object
*    properties:
*      admin:
*        type: boolean
*        description: App owner .
*      username:
*        type: string
*        description: User Name  .
*      password:
*        type: string
*        description: Password Hash  .
*      firstname:
*        type: string
*        description: firstname String  .
*      lastname:
*        type: string
*        description: lastname String  .
*/
/**
* @swagger
* /api/users/forget:
*    post:
*      description: This Reset and Forget Password
*      tags:
*       - user
*      parameters:
*       - in: body
*         name: body
*         description: Group information
*         required: true
*         schema:
*           type: object
*           required:
*             - email
*           properties:
*             email:
*               type: string
*      responses:
*        '200':
*          description: Password has been changed Successfully
*        '500':
*          description: Sever Error.
*        '402':
*          description: User is InActive
*        '404':
*          description: Email not Found
*        '502' :
*          description: Password Could not be saved
*/
// Forget Password
router.post("/forget",  userCtrl.forgetPassword);
// Add user
/**
* @swagger
* /api/users/register:
*    post:
*      description: This Register New User
*      tags:
*       - user
*      parameters:
*       - in: body
*         name: body
*         description: Group information
*         required: true
*         schema:
*           type: object
*           required:
*             - email
*             - mobile
*             - name
*             - password
*             - timezone
*           properties:
*             email:
*               type: string
*             password:
*               type: string
*             firstname:
*               type: string
*             lastname:
*               type: string
*      responses:
*        '200':
*          description: Password has been changed Successfully
*        '500':
*          description: Sever Error.
*        '501':
*          description: Email already Exist
*        '400':
*          description: Email not Found
*        '502' :
*          description: Password Could not be saved
*/
// Add user
router.post("/register", userCtrl.register);

/**
* @swagger
* /api/users/login:
*    post:
*      description: This should Login User
*      tags:
*       - user
*      parameters:
*       - in: body
*         name: body
*         description: Group information
*         required: true
*         schema:
*           type: object
*           required:
*             - email
*             - password
*           properties:
*             email:
*               type: string
*             password:
*               type: string
*      responses:
*        '200':
*          description: Login successful/ Unverified / InActive!
*        '500':
*          description: Sever Error.
*        '401':
*          description: Password Or Username is incorrect
*        '400' :
*          description: Missing Required parameter
*/
// Login
router.post("/login", userCtrl.login);
/**
* @swagger
* /api/users/logout:
*    get:
*      description: This Return User Model
*      tags:
*       - user
*      security:
*        - Bearer: []
*      responses:
*        '200':
*          description: Logout has been changed Successfully
*        '500':
*          description: Sever Error.
*        '401':
*          description: UnAuthorized Or not Token Provided.
*/
// Logout
// Logout
router.get("/logout", userCtrl.logout);
/**
* @swagger
* /api/users/me:
*    get:
*      description: This Return User Model
*      tags:
*       - user
*      security:
*        - Bearer: []
*      responses:
*        '200':
*          description: logout  Successfully
*        '500':
*          description: Sever Error.
*        '401':
*          description: UnAuthorized Or not Token Provided.
*/
// Verify Me
router.get("/me", verify.user, userCtrl.verfiyMe);
/**
* @swagger
* /api/users/verify:
*    get:
*      description: This should Verify The User
*      tags:
*       - user
*      parameters:
*      - name : email
*        required: true
*        in: query
*        description: example.com
*        style: form
*        explode: true
*        type: string
*      - name : pin
*        required: true
*        in: query
*        description: PIN CODE
*        style: form
*        explode: true
*        type: number
*      responses:
*        '200':
*          description: Successfully User Already Verified
*        '500':
*          description: Sever Error.
*        '502':
*          description: Pin Code is not valid.
*        '300':
*          description: User Already Verify
*        '400' :
*          description: Missing Required parameter
*/
// Verify user
router.get("/verify", userCtrl.verifyPinCode);
/**
* @swagger
* /api/users/pin/resend:
*    get:
*      description: This should Resend Verify Code
*      tags:
*       - user
*      parameters:
*      - name : email
*        required: true
*        in: query
*        description: email id for resend
*        style: form
*        explode: true
*        type: string
*      responses:
*        '200':
*          description: Successfully Resen Verified code
*        '500':
*          description: Sever Error.
*        '400' :
*          description: Missing Required parameter
*        '404' :
*          description: User not Found
*/
// Resend Verify user
router.get("/pin/resend", userCtrl.resendVerifyPinCode);
/**
* @swagger
* /api/users/{id}:
*    get:
*      description: This will return User On User ID
*      tags:
*       - user
*      parameters:
*      - name : id
*        required: true
*        in: path
*        description: id of  User Doc
*        style: form
*        explode: true
*        type: string
*      responses:
*        '200':
*          description: Password has been changed Successfully
*        '500':
*          description: Sever Error.
*        '404':
*          description: Email not Found
*/
// get User By Id
router.get("/:id", userCtrl.userGetById);
/**
* @swagger
* /api/users/:
*    get:
*      description: Get all Users
*      tags:
*       - user
*      responses:
*        '200':
*          description: All User  get.
*        '500':
*          description: Sever Error.
*/
// GET users

router.get("/", userCtrl.listAll);

export default router;
