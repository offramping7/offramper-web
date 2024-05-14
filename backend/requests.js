import axios from "axios";

export const getGeoInfo = async () => {
    return axios.get('https://ipapi.co/json/').then((res) => {
        let data = res.data;
        const country_code = data.country_code
        return country_code
        
    }).catch((err) => {
        console.log(err);
    });
  };

  export const createOfframpAddress = async (payload) => {
    const url = "/api/createOfframpAddress"
    return axios.post(url,payload).then((res) => {
        return res.data
    })
  };