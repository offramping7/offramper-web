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
    return {address:"123",blockchain:"123",cryptocurrency:"123"}
    return axios.post(url,payload).then((res) => {
        console.log("GO THE REESSSSSS",res.data)
        return res.data
    }).catch((err)=> {
        console.log("errrr!", err)
    })
  };