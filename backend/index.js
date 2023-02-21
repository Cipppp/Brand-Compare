const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config();

//? Create a new express app
const app = express();
//? Set up the server to listen on port 8080
app.use(cors());

//? Parse request bodies as JSON
app.use(bodyParser.json());

//? Get API endpoint and API key from environment variables
const API_ENDPOINT = process.env.API_ENDPOINT;
const API_KEY = process.env.API_KEY;
const REQUEST_CONFIG = {
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
    },
};
//? Define port for the server to listen on and start the server
app.post('/api/brands', (req, res) => {
    console.log('I am on endpoint /api/brands!');
    const REQUEST_DATA = {
        jsonrpc: '2.0',
        id: 0,
        method: 'socialinsider_api.get_brands',
        params: {
            projectname: 'API_test',
        },
    };
    axios
        .post(API_ENDPOINT, REQUEST_DATA, REQUEST_CONFIG)
        .then((response) => {
            const data = response.data.result;
            res.json(data);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error fetching data');
        });
});

//? Endpoint for getting profile data for a brand
app.post('/api/get-profile-data', async (req, res) => {
    console.log('I am on endpoint /api/get-profile-data!');

    const { brandData, startDate, endDate } = req.body;

    let totalFans = 0;
    let totalEngagement = 0;

    //? Create an array of promises for each profile
    const requests = brandData.profiles.map((profile) => {
        const requestData = {
            id: 1,
            method: 'socialinsider_api.get_profile_data',
            params: {
                id: profile.id,
                profile_type: profile.profile_type,
                date: {
                    start: new Date(startDate).getTime(),
                    end: new Date(endDate).getTime(),
                    timezone: 'Europe/London',
                },
            },
        };

        return axios
            .post(API_ENDPOINT, requestData, REQUEST_CONFIG)
            .then((response) => {
                //? Get the first, second and third element of the response and check if the followers and engagement are not null
                const profileData = response.data.resp[profile.id];
                let firstElement = profileData[Object.keys(profileData)[0]];
                let secondElement = profileData[Object.keys(profileData)[1]];
                let thirdElement = profileData[Object.keys(profileData)[2]];

                if (
                    firstElement.followers !== null &&
                    firstElement.engagement !== null
                ) {
                    totalFans += firstElement.followers;
                    totalEngagement += firstElement.engagement;
                } else if (
                    secondElement.followers !== null &&
                    secondElement.engagement !== null
                ) {
                    totalFans += secondElement.followers;
                    totalEngagement += secondElement.engagement;
                } else if (
                    thirdElement.followers !== null &&
                    thirdElement.engagement !== null
                ) {
                    totalFans += thirdElement.followers;
                    totalEngagement += thirdElement.engagement;
                }

                return {
                    brandname: brandData.brandname,
                    totalProfiles: brandData.profiles.length,
                    totalFans,
                    totalEngagement,
                };
            })
            .catch((error) => {
                console.error(error);
            });
    });

    try {
        const results = await Promise.all(requests);
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
