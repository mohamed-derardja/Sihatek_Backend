import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs";
import { ENV } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

const ACCOUNT_ID = ENV.cloudflareAccountId;
const R2_ACCESS_KEY_ID = ENV.r2AccessKeyId;
const R2_SECRET_ACCESS_KEY = ENV.r2SecretAccessKey;

const BUCKET_NAME = ENV.bucketName;

const endpoint = `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`;


// Cloudflare R2 credentials
const client = new S3Client({
    region: "auto",
    endpoint: endpoint,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
});


export async function uploadFile(filePath, key) {
    const fileStream = fs.createReadStream(filePath);

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: fileStream,
    });

    try {
        await client.send(command);
        return { path: key, url: await getPresignedUrl(key) };
    } catch (err) {
        throw new AppError('Failed to upload file', 500, 'UPLOAD_FILE_ERROR');
    }
}

export async function getPresignedUrl(key, expiresInSeconds = 3600) {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
    });
    return await getSignedUrl(client, command, { expiresIn: expiresInSeconds });
}

export async function deleteFile(key) {
    const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
    });
    return await client.send(command);
}

export async function downloadFile(key, downloadPath) {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
    });

    try {
        const data = await client.send(command);
        const bodyStream = data.Body;
        const writeStream = fs.createWriteStream(downloadPath);
        await new Promise((resolve, reject) => {
            bodyStream.pipe(writeStream)
                .on('finish', resolve)
                .on('error', reject);
        });
    } catch (err) {
        throw new AppError('Failed to download file', 500, 'DOWNLOAD_FILE_ERROR');
    }
}


export async function listFiles() {
    const command = new ListObjectsCommand({
        Bucket: BUCKET_NAME,
    });

    try {
        const data = await client.send(command);
        return data.Contents || [];
    } catch (err) {
        throw new AppError('Failed to list files', 500, 'LIST_FILES_ERROR');
    }
}


export function deleteFileFromLocal(filePath) {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                reject(new AppError("Failed to delete local file", 500, "DELETE_FILE_ERROR"));
            } else {
                resolve();
            }
        });
    });
}