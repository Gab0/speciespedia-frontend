 
import axios from 'axios';

const backendServer = process.env.REACT_APP_BACKEND_ADDRESS || "localhost";
export const backendUrl = "http://" + backendServer + ":5000";

function backendRequest(endpoint, data) {

  return axios({
    method: 'post',
    url: backendUrl + endpoint,
    data: data,
    responseType: 'json',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

}

export default backendRequest;
