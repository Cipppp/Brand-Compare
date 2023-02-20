# **React App with Chart.js and API integration**

This is a React web application that retrieves brand data using an API endpoint and displays it in a tabular format. The application utilizes axios to make requests to the API, and state management to update the UI when data is returned. The data is fetched and displayed in a table, which allows the user to view and interact with the data. The table is responsive, and can be viewed on desktop or mobile devices. Additionally, the project includes a CORS proxy to bypass any cross-origin request issues.

## **Requirements**

Node.js 14 or later

## **Getting Started**

1. Clone the repository:

```
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

2. Install dependencies:

```
npm install
```

3. Start the development server:

```
npm start
```

4. Access the app in your browser at **http://localhost:3000.**

## **Configuration**

The following environment variables must be set:

-   `REACT_APP_API_ENDPOINT`: The URL of the API endpoint.
-   `REACT_APP_API_KEY`: The API key.

## **Usage**

The app fetches data from the API and displays a table with the selected date range data. The data can be customized by modifying the API request parameters.

## **Credits**

The following libraries and tools were used:

-   React.js
-   Axios
-   CORS Anywhere

## **License**

This project is licensed under the MIT License. See the LICENSE file for more information.
