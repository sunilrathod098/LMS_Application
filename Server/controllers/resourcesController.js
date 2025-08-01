import { v2 as cloudinary } from "cloudinary";
import {Resource} from "../models/resourceModel.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Add Resource to Course (Admin/Instructor only)
export const addResource = asyncHandler(async (req, res) => {
    try {
        const { courseId } = req.params;
        const { name } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
            folder: "LMS_Application/images/resources",
        });

        const resource = await Resource.create({
            courseId,
            name,
            fileUrl: result.secure_url,
        });

        return res.status(201).json(
            new ApiResponse(
                201,
                "Resource added successfully",
                resource
            )
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Resource (Admin/Instructor only)
export const deleteResource = asyncHandler(async (req, res) => {
    try {
        const { resourceId } = req.params;

        // Delete from Cloudinary (optional: extract public_id from URL)
        // await cloudinary.uploader.destroy(public_id);

        const resource = await Resource.findByIdAndDelete(resourceId);
        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }
        // Optionally, delete the file from Cloudinary
        await cloudinary.uploader.destroy(resource.fileUrl.split('/').pop().split('.')[0], {
            resource_type: 'auto'
        });


        return res.status(200).json(
            new ApiResponse(
                200,
                "Resource deleted successfully"
            )
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get All Resources for a Course
export const getCourseResources = asyncHandler(async (req, res) => {
    try {
        const { courseId } = req.params;
        const resources = await Resource.find({ courseId });

        if (!resources || resources.length === 0) {
            return res.status(404).json({ message: "No resources found for this course" });
        }
        return res.status(200).json(
            new ApiResponse(
                200,
                "Resources retrieved successfully",
                resources
            )
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});