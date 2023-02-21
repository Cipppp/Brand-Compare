import './App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import ProfileChart from './components/ProfileChart';

//? Get API endpoint and API key from environment variables
const API_KEY = process.env.REACT_APP_API_KEY;

function App() {
    //? State for data
    const [jsonBrandsData, setJsonBrandsData] = useState([]);

    //? Get brands data from API
    const getBrands = async () => {
        try {
            const response = await axios.post(
                'http://localhost:8080/api/brands',
                {
                    projectName: 'API_test',
                }
            );
            const brands = response.data;
            setJsonBrandsData(brands);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        //? Get brands data from API
        getBrands();
    }, []);

    return (
        <div className="App">
            <ProfileChart jsonBrandsData={jsonBrandsData} />
        </div>
    );
}

export default App;
