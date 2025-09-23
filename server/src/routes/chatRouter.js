const { protect } = require("../middleware/authMiddleware");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatControllers");
const router = require("express").Router();

router.route(`/`).post(protect, accessChat);
router.route(`/`).get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/group-rename").put(protect, renameGroupChat);
router.route("/group-remove").put(protect, removeFromGroup);
router.route("/group-add").put(protect, addToGroup);

module.exports = router;
