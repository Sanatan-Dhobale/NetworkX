import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const getAllPosts = createAsyncThunk(
    "post/getAllPosts",
    async (_, thunkAPI) => {
        try {

            const response = await clientServer.get("/posts");

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {

            return thunkAPI.rejectWithValue(err.response.data);

        }
    }
)


export const createPost = createAsyncThunk(
    "post/createPost",
    async (userData, thunkAPI) => {
        const { file, body } = userData;

        try {

            const formData = new FormData();
            formData.append("token", localStorage.getItem("token"))
            formData.append("body", body)
            formData.append("media", file)

            const response = await clientServer.post("/post", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if (response.status === 200) {
                return thunkAPI.fulfillWithValue("Post Uploaded");
            } else {
                return thunkAPI.rejectWithValue("Post not uploaded");
            }

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);

        }
    }
)


export const deletePost = createAsyncThunk(
    "post/deletePost",
    async (post_id, thunkAPI) => {
        try {

            const response = await clientServer.delete("/delete_post", {
                data: {
                    token: localStorage.getItem("token"),
                    post_id: post_id.post_id
                }
            });

            return thunkAPI.fulfillWithValue(response.data)

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);

        }
    }
)

export const incrementPostLike = createAsyncThunk(
    "post/incrementPostLike",
    async (post, thunkAPI) => {
        try {
            console.log(post.post_id);


            const response = await clientServer.post("/increment_post_like",
                {
                    post_id: post.post_id
                }
            )

            return thunkAPI.fulfillWithValue(response.data)


        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);

        }
    }
)

export const handleShare = createAsyncThunk(
    "post/share",
    async (post, thunkAPI) => {
        try {

            if (navigator.share) {
                await navigator.share({
                    title: post.userId.name,
                    text: post.body,
                    url: `${window.location.origin}/post/${post._id}`
                })
            } else {
                navigator.clipboard.writeText(
                    `${window.location.origin}/post/${post._id}`
                )
            }

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);

        }
    }
)

export const getAllComments = createAsyncThunk(
    "post/getAllComments",
    async (postdata, thunkAPI) => {
        try {

            const response = await clientServer.get("/get_comments", {
                params: {
                    post_id: postdata.post_id
                }
            });

            return thunkAPI.fulfillWithValue({
                comments: response.data,
                post_id: postdata.post_id,
            })

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);

        }
    }
)

export const postComment = createAsyncThunk(
    "post/comment",
    async (commentData, thunkAPI) => {
        try {

            console.log({
                post_id: commentData
            })

            const response = await clientServer.post("/comment", {
                token: localStorage.getItem("token"),
                post_id: commentData.post_id,
                commentBody: commentData.body
            });

            return thunkAPI.fulfillWithValue(response.data);

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);

        }
    }
)