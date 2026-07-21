import { Router } from "express";
import { activeCheck } from "../controllers/posts.controller.js";
import multer from "multer";
import { createPost, getAllPost, deletePost, commentPost, get_comment_by_post, delete_comment_of_user, increment_likes} from "../controllers/posts.controller.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const router = Router();

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "networkx",
        allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"]
    }
});

const upload = multer({
    storage
});

router.route('/').get(activeCheck);

router.route("/post").post(upload.single("media"), createPost);
router.route("/posts").get(getAllPost);
router.route("/delete_post").delete(deletePost);
router.route("/comment").post(commentPost);
router.route("/get_comments").get(get_comment_by_post);
router.route("/delete_comment").delete(delete_comment_of_user);
router.route("/increment_post_like").post(increment_likes);

export default router;