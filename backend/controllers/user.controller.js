import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import Profile from "../models/profile.model.js"
import crypto from "crypto";
import fs from "fs";
import PDFDocument from "pdfkit";
import ConnectionRequest from "../models/connections.model.js";
import Post from "../models/posts.model.js";
import axios from "axios";

const convertUserDataToPDF = async (userData) => {

    const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";

    const doc = new PDFDocument({
        size: "A4",
        margin: 50
    });

    const stream = fs.createWriteStream("uploads/" + outputPath);

    doc.pipe(stream);

    doc
        .fillColor("#2563EB")
        .fontSize(28)
        .text("NetworkX Resume", {
            align: "center"
        });

    doc.moveDown();

    const response = await axios.get(userData.userId.profilePicture, {
        responseType: "arraybuffer"
    });

    const imagePath = Buffer.from(response.data);


    const imageX = 100;
    const imageY = 100;

    doc.image(imagePath, imageX, imageY, {
        width: 90,
        height: 90
    });

    const textX = imageX + 110;

    doc
        .fillColor("black")
        .fontSize(24)
        .text(userData.userId.name, textX, imageY + 15);

    doc
        .fillColor("#64748B")
        .fontSize(15)
        .text(`@${userData.userId.username}`, textX, imageY + 45);

    doc.moveDown();

    doc
        .fillColor("black")
        .fontSize(13)
        .text(`Email : ${userData.userId.email}`);

    doc.text(
        `Current Position : ${userData.userId.curerntPost || "Not Provided"}`
    );

    doc.moveDown();

    doc
        .fontSize(15)
        .fillColor("#2563EB")
        .text("Professional Summary");

    doc.moveDown(0.5);

    doc
        .fillColor("black")
        .fontSize(12)
        .text(
            userData.bio || "No bio added.",
            {
                align: "justify"
            }
        );

    doc.moveDown();

    doc
        .fillColor("#2563EB")
        .fontSize(18)
        .text("Work Experience");

    doc.moveDown();

    if (userData.pastWork.length === 0) {

        doc.text("No work experience.");

    } else {

        userData.pastWork.forEach((work) => {

            doc
                .fillColor("black")
                .fontSize(14)
                .text(work.position, {
                    underline: true
                });

            doc
                .fontSize(12)
                .text(`Company : ${work.company}`);

            doc.text(`Experience : ${work.years}`);

            doc.moveDown();
        });

    }

    doc.moveDown();

    doc
        .fillColor("#2563EB")
        .fontSize(18)
        .text("Education");

    doc.moveDown();

    if (userData.education.length === 0) {

        doc.text("No education added.");

    } else {

        userData.education.forEach((edu) => {

            doc
                .fillColor("black")
                .fontSize(14)
                .text(edu.degree, {
                    underline: true
                });

            doc
                .fontSize(12)
                .text(`School : ${edu.school}`);

            doc.text(`Field : ${edu.fieldOfStudy}`);

            doc.moveDown();

        });

    }

    doc.moveDown(2);

    doc
        .fontSize(10)
        .fillColor("gray")
        .text(
            "Generated automatically by NetworkX",
            {
                align: "center"
            }
        );

    doc.end();

}


export const register = async (req, res) => {
    try {
        const { name, email, password, username } = req.body;

        if (!name || !email || !password || !username) return res.status(400).json({ message: "All fields are required" });

        const user = await User.findOne({ email });

        if (user) return res.status(404).json({ message: "User already exist." });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            username,
        });

        await newUser.save();

        const profile = new Profile({ userId: newUser._id });

        await profile.save()

        return res.json({ message: "User registered successfully" });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ message: "All fields are required" });

        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User does not exist" });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        const token = crypto.randomBytes(32).toString("hex");

        await User.updateOne({ _id: user.id }, { token });

        return res.json({ token })

    } catch (err) {
        return res.status(500).json({ message: err.message });

    }
}

export const uploadProfilePicture = async (req, res) => {
    const { token } = req.body;

    try {
        const user = await User.findOne({ token: token });

        if (!user) return res.status(404).json({ message: "User not found" });

        user.profilePicture = req.file.path;

        await user.save();

        console.log(user.profilePicture)

        return res.status(200).json({
            message: "Profile picture uploaded successfully",
            profilePicture: user.profilePicture
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

export const updateUserProfile = async (req, res) => {
    try {

        const { token, ...newUserData } = req.body;
        const user = await User.findOne({ token });

        if (!user) return res.status(404).json({ message: "User not found" });

        const { username, email } = newUserData;

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });


        if (existingUser && String(existingUser._id) !== String(user._id)) {
            return res.status(400).json({ message: "User already exist" });
        }


        Object.assign(user, newUserData);

        await user.save();

        res.json({ message: "User updated" })


    } catch (err) {
        return res.status(500).json({ message: err.message });

    }
}


export const getUserAndProfile = async (req, res) => {
    try {
        const { token } = req.query;

        const user = await User.findOne({ token: token });

        if (!user) return res.status(404).json({ message: "user not found" });

        const userProfile = await Profile.findOne({ userId: user._id })
            .populate("userId", "name email username profilePicture");

        return res.json(userProfile);

    } catch (err) {
        return res.status(500).json({ message: err.message });

    }
}

export const updateProfileData = async (req, res) => {
    try {

        const { token, ...newProfileData } = req.body;

        const userProfile = await User.findOne({ token: token });

        if (!userProfile) res.status(404).json({ message: "user not found" });

        const profile_to_update = await Profile.findOne({ userId: userProfile._id });

        Object.assign(profile_to_update, newProfileData);

        profile_to_update.save();

        return res.json({ message: "Profile Updated" });



    } catch (err) {
        return res.status(500).json({ message: err.message });

    }
}

export const getAllUserProfile = async (req, res) => {
    try {

        const profiles = await Profile.find().populate('userId', 'name username email profilePicture');

        res.json({ profiles });

    } catch (err) {
        return res.status(500).json({ message: err.message });

    }
}

export const donwloadProfile = async (req, res) => {
    try {

        const user_id = req.query.id;
        const userProfile = await Profile.findOne({ userId: user_id })
            .populate("userId", "name username email profilePicture");

        let outputPath = await convertUserDataToPDF(userProfile);

        return res.json({ "message": outputPath });


    } catch (err) {
        return res.status(500).json({ message: err.message });

    }
}

export const sendConnectionRequest = async (req, res) => {

    const { token, connectionId } = req.body;

    try {

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const connectionUser = await User.findOne({ _id: connectionId });

        if (!connectionUser) {
            return res.status(404).json({ message: "Connection user not found" });
        }

        const existingRequest = await ConnectionRequest.findOne({
            userId: user._id,
            connectionId: connectionUser._id
        });

        if (existingRequest) {
            return res.status(400).json({ message: "Requesr already send" });
        }

        const request = new ConnectionRequest({
            userId: user._id,
            connectionId: connectionUser._id
        });

        await request.save();

        return res.json({ message: "Request send" });


    } catch (err) {
        return res.status(500).json({ message: err.message });

    }

}

export const getMyConnectionsRequests = async (req, res) => {

    const { token } = req.query;

    try {

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const connections = await ConnectionRequest.find({ userId: user._id })
            .populate("connectionId", "name username email profilePicture");

        return res.json(connections);

    } catch (err) {
        return res.status(500).json({ message: err.message });

    }

}

export const whatAreMyConnections = async (req, res) => {
    const { token } = req.query;

    try {

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const connections = await ConnectionRequest.find({ connectionId: user._id })
            .populate("userId", "name username email profilePicture");

        return res.json(connections);

    } catch (err) {
        return res.status(500).json({ message: err.message });

    }
}

export const acceptConnectionRequest = async (req, res) => {

    const { token, requestId, action_type } = req.body;

    try {

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const connection = await ConnectionRequest.findOne({ _id: requestId });

        if (!connection) {
            return res.status(404).json({ message: "connection not found" });
        }

        if (action_type === "accept") {
            connection.status_accepted = true;
        } else {
            connection.status_accepted = false;
        }

        await connection.save();

        return res.json({ message: "Request Updated" });


    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


export const getUserProfileAndUserBasedOnUsername = async (req, res) => {

    const { username } = req.query;

    try {

        const user = await User.findOne({ username: username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userProfile = await Profile.findOne({ userId: user._id }).populate("userId", "name username email profilePicture");

        return res.json({ "profile": userProfile });


    } catch (err) {
        return res.status(500).json({ message: err.message });

    }
}

