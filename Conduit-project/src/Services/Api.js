import axios from "axios";

const BASE_URL = "https://conduitservices.azure-api.net"

const getPreIntegrationData = async() => {
   
        //call api
        const res = await axios.get(`${BASE_URL}/api/dist/reports/store_integration?distributor_id=DIST1234&store_id=672367`, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                "Ocp-Apim-Subscription-Key" : "7811bc75ff834fcbab4c881267657673"
            }
        })
        return res
     
}

const getIntegrationData = async() => {
    const res = await axios.get(`${BASE_URL}/api/dist/store/store_integration?store_id=672367`, {
    headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key" : "7811bc75ff834fcbab4c881267657673"
        }
    })
    return res
}

const getDashBoardData = async() => {
    const res = await axios.get(`${BASE_URL}/dashboard/overview?distributor_id=DIST1234&store_id=672367`,{
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key" : "7811bc75ff834fcbab4c881267657673"
    }
    })
    return res
}

export {getPreIntegrationData, getIntegrationData, getDashBoardData}
