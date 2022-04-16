 
import axios from 'axios';

const backendUrl = "http://localhost:5000"

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
