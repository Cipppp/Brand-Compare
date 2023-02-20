import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
const API_KEY = process.env.REACT_APP_API_KEY;
const REQUEST_CONFIG = {
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
    },
};

const ProfileChart = ({ jsonBrandsData }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [brandsData, setBrandsData] = useState([]);

    // initialize totals
    const getProfileData = (brandData, startDate, endDate) => {
        let totalFans = 0;
        let totalEngagement = 0;

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

        Promise.all(requests).then((results) => {
            setBrandsData((prevData) => {
                const updatedBrands = results.reduce(
                    (acc, result) => {
                        const brandIndex = acc.findIndex(
                            (brand) => brand.brandname === result.brandname
                        );
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

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    useEffect(() => {
        // get data for all brandData using the selected date range
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
