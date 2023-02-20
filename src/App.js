import './App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import ProfileChart from './components/ProfileChart';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
const API_KEY = process.env.REACT_APP_API_KEY;
const REQUEST_CONFIG = {
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
    },
};
// Request data
const REQUEST_DATA = {
    jsonrpc: '2.0',
    id: 0,
    method: 'socialinsider_api.get_brands',
    params: {
        projectname: 'API_test',
    },
};

function App() {
    // State for data
    const [jsonBrandsData, setJsonBrandsData] = useState([]);

    const getBrands = () => {
        const requestData = {
            id: 1,
            method: 'socialinsider_api.get_brands',
            params: {
                projectname: 'API_test',
            },
        };

        axios
            .post(API_ENDPOINT, requestData, REQUEST_CONFIG)
            .then((response) => {
                setJsonBrandsData(response.data.result);
                console.log(response.data.result);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        getBrands();
    }, []);

    return (
        <div className="App">
            <ProfileChart jsonBrandsData={jsonBrandsData} />
        </div>
    );
}

export default App;
