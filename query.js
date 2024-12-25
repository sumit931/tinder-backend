import axios from 'axios';
import mongoose from "mongoose";
import DbCards from './dbCards.js';

const unsplashApiUrl = 'https://unsplash.com/napi/collections/2243806/photos?page=10&per_page=20&share_key=68fb07026758726e6b37256d299df571';
let pg = 1;

async function connectDB() {
    try {
        await mongoose.connect(connectionUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Successfully connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

async function fetchData() {
    try {
        const response = await axios.get(unsplashApiUrl);
        const photoData = response.data.map((element) => ({
            name: element.user.name,
            url: element.urls.full
        }));

        // Process each photo individually
        let successCount = 0;
        let failureCount = 0;

        for (const element of photoData) {
            try {
                await DbCards.create(element);
                successCount++;
            } catch (error) {
                if (error.code === 11000) { // MongoDB duplicate key error code
                    console.log(`Skipping duplicate entry for user: ${element.name}`);
                    failureCount++;
                } else {
                    console.error('Error saving photo:', error);
                    failureCount++;
                }
            }
        }

        console.log(`Successfully saved ${successCount} photos to database`);
        console.log(`Skipped ${failureCount} duplicate/failed entries`);

        return photoData;
    } catch (error) {
        console.error('Error fetching or processing photos:', error);
        throw error;
    }
}

async function main() {
    try {
        await connectDB();
        const photos = await fetchData();
        console.log(`Processed ${photos.length} total photos`);
    } catch (error) {
        console.error('Application error:', error);
        process.exit(1);
    }
}

main();