const router = require( "express" ).Router();
const User = require( "../models/User.model" );
const bcrypt = require( "bcrypt" );

//REGISTER
router.post( "/register", async (req, res) => {
	try {
		//generate new password
		const salt = await bcrypt.genSalt( 10 );
		const hashedPassword = await bcrypt.hash( req.body.passWord, salt );

		//create new user
		const newUser = new User( {
			userName: req.body.userName,
			phoneNumber: req.body.phoneNumber,
			passWord: hashedPassword,
		} );

		//save user and respond
		const user = await newUser.save();
		res.status( 200 ).json( user );
	} catch (err) {
		res.status( 500 ).json( err )
	}
} );

//LOGIN
router.post( "/authentication", async (req, res) => {
	try {
		const user = await User.findOne( {phoneNumber: req.body.phoneNumber} );
		!user && res.status( 404 ).json( "user not found" );

		const validPassword = await bcrypt.compare( req.body.passWord, user.passWord )
		!validPassword && res.status( 400 ).json( "wrong password" )

		res.status( 200 ).json( user )
	} catch (err) {
		res.status( 500 ).json( err )
	}
} );

module.exports = router;
