import { uploadOnCloud } from '../config/cloudinary.js';
import { User } from '../models/userModel.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';



export const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, `Something went wrong while generating tokens: ${error.message}`)
    }
};


export const signupUser = asyncHandler(async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if ([name, email, password, role].some((field) => field?.trim() === "")) {
            throw new ApiError(400, "All fields are required");
        }

        const existingUser = await User.findOne({
            $or: [{ name }, { email }]
        })
        if (existingUser) {
            throw new ApiError(400, "User with this name or email already exists");
        }

        const avatarLocalPath = req.files?.avatar[0].path.replace(/\\/g, "/");
        const avatar = await uploadOnCloud(avatarLocalPath);
        if (!avatar) {
            throw new ApiError(500, "Failed to upload avatar");
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            avatar: {
                public_id: avatar.public_id
            }
        })

        const createdUser = await User.findById(user._id).select("-password -refreshToken");

        return res.status(200).json(
            new ApiResponse(
                200,
                "User registered successfully",
                createdUser
            ));
    } catch (error) {
        throw new ApiError(500, `Something went wrong while registering user: ${error.message}`);
    }
});

export const signinUser = asyncHandler(async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if ([name, email, password].some((field) => field?.trim() === "")) {
            throw new ApiError(400, "Email and password are required");
        }

        const user = await User.findOne({ $or: [{ email }, { name }] }).select("+password");
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const isPasswordMatch = await user.isPasswordCorrect(password);
        if (!isPasswordMatch) {
            throw new ApiError(400, "Invalid credentials");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
        const userLoggedIn = await User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none'
        };

        return res.status(200)
            .cookie('refreshToken', refreshToken, options)
            .cookie('accessToken', accessToken, options)
            .json(
                new ApiResponse(
                    200,
                    "User logged in successfully",
                    userLoggedIn
                ));
    } catch (error) {
        throw new ApiError(500, `Something went wrong while logging in user: ${error.message}`);
    }
});


export const resetPassword = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || email.trim() === "") {
            throw new ApiError(400, "Email is required");
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(400, "User not found");
        }

        const resetToken = user.generateResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/reset-password/${resetToken}`;
        const message = `Reset your password by clicking on the link: ${resetUrl}`;

        await sendEmail(email, "Reset Password", message);

        return res.status(200).json(
            new ApiResponse(
                200,
                "Reset password link sent to your email",
                { email, resetUrl }
            ));
    } catch (error) {
        throw new ApiError(500, `Something went wrong while resetting password: ${error.message}`);
    }
});


export const updateAvatar = asyncHandler(async (req, res) => {
    try {
        const avatarLocalPath = req.file.path.replace(/\\/g, "/");
        if (!avatarLocalPath) {
            throw new ApiError(400, "Avatar is required");
        }

        const avatar = await uploadOnCloud(avatarLocalPath);
        if (!avatar.url) {
            throw new ApiError(500, "Failed to upload avatar");
        }

        const user = await User.findByIdAndUpdate(req.user._id, {
            $set: {
                avatar: avatar.url
            }
        }, {
            new: true,
            runValidators: true
        }).select("-password -refreshToken");

        return res.status(200).json(
            new ApiResponse(
                200,
                "Avatar updated successfully",
                user
            ));
    } catch (error) {
        throw new ApiError(500, `Something went wrong while updating avatar: ${error.message}`);
    }
});