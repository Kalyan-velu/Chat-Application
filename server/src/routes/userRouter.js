const User = require("../models/userModel");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const router = require("express").Router();

router.route("/register").post(registerUser);
router.post("/login", authUser);
router.route("/").get(protect, allUsers);

//update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (e) {
        console.log(e);
        return res.status(500).json(e);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account Updated");
    } catch (e) {
      return res.status(500).json(e);
    }
  } else {
    return res.status(403).json("You can update only your account !");
  }
});
router.get("/", (req, res) => {
  res.send("User");
});
module.exports = router;
