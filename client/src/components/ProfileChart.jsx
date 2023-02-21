import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProfileChart = ({ jsonBrandsData }) => {
    //? State for data
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [brandsData, setBrandsData] = useState([]);

    //? Fetch data for all brand data using the selected date range
    const getProfileData = async (brandData, startDate, endDate) => {
        console.log('Function called');
        const requestData = {
            brandData,
            startDate,
            endDate,
        };

        try {
            const response = await axios.post(
                'http://localhost:8080/api/get-profile-data',
                requestData
            );
            const data = response.data;
            //? Update the state with the new data only if the data is not empty and the brand is not already in the state and update the state when new date is selected
            console.log(data);

            if (data.length > 0) {
                console.log('length: ' + data.length);
                //? Check if the brand is already in the state
                const brandIndex = brandsData.findIndex(
                    (brand) => brand.brandname === data[0].brandname
                );
                if (brandIndex === -1) {
                    setBrandsData((prevState) => [...prevState, data[0]]);
                } else {
                    //? Update the state with the new data
                    setBrandsData((prevState) => {
                        const newBrandsData = [...prevState];
                        newBrandsData[brandIndex] = data[0];
                        return newBrandsData;
                    });
                }
            }
        } catch (error) {
            console.error(error);
        }
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
