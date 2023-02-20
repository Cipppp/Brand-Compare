import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';

//? Get API endpoint and API key from environment variables
const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
const API_KEY = process.env.REACT_APP_API_KEY;
const REQUEST_CONFIG = {
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
    },
};

const ProfileChart = ({ jsonBrandsData }) => {
    //? State for data
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [brandsData, setBrandsData] = useState([]);

    //? Fetch data for all brand data using the selected date range
    const getProfileData = (brandData, startDate, endDate) => {
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
                        start: startDate.getTime(),
                        end: endDate.getTime(),
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
                    let secondElement =
                        profileData[Object.keys(profileData)[1]];
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

        //? Wait for all promises to resolve and update the state
        Promise.all(requests).then((results) => {
            setBrandsData((prevData) => {
                //? Update the state with the new data
                const updatedBrands = results.reduce(
                    //? If the brand already exists in the state, update it, otherwise add it
                    (acc, result) => {
                        //? Find the index of the brand in the state
                        const brandIndex = acc.findIndex(
                            (brand) => brand.brandname === result.brandname
                        );

                        //? If the brand exists, update it, otherwise add it
                        if (brandIndex !== -1) {
                            acc[brandIndex] = result;
                        } else {
                            acc.push(result);
                        }
                        return acc;
                    },
                    [...prevData]
                );
                return updatedBrands;
            });
        });
    };

    //? Handle date change and update the state with the new date
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    useEffect(() => {
        //? Get data for all brandData using the selected date range when the selected date changes
        const startDate = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            0,
            0,
            0
        );
        const endDate = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            23,
            59,
            59
        );

        //? Get data for all brands using the selected date range
        jsonBrandsData.forEach((brandData) => {
            getProfileData(brandData, startDate, endDate);
        });
    }, [selectedDate]);

    return (
        <div>
            <h1>Profile Chart</h1>
            <DatePicker selected={selectedDate} onChange={handleDateChange} />
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Brand</th>
                        <th>Profiles</th>
                        <th>Fans</th>
                        <th>Engagement</th>
                    </tr>
                </thead>
                <tbody>
                    {brandsData.map((brand) => (
                        <tr key={brand.brandname}>
                            <td>{brand.brandname}</td>
                            <td>{brand.totalProfiles}</td>
                            <td>{brand.totalFans}</td>
                            <td>{brand.totalEngagement}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProfileChart;
