import axios from "axios";

const HOST = "http://localhos   t:3002"
export class APIReq {
    async getRequest(path, params = {}) {
        const token = document.cookie.replace("Authorization=", "");
        try {
            const head = {
                'Content-Type': 'application/json'
            };

            if (token) {
                head.Authorization = `Bearer ${token}`;
            }

            const queryString = new URLSearchParams(params).toString();
            const url = queryString ? `${HOST}${path}?${queryString}` : `${HOST}${path}`;

            const config = {
                method: 'GET',
                headers: head
            };

            const response = await fetch(url, config);
            if (response.ok) {
                try{
                    const data = await response.json();
                    return data;
                }catch (error){
                    return null
                }
            } else {
                return response.status;
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    

    // POST request function
    async postRequest(path, body){
        const token = document.cookie.replace("Authorization=", "");
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            const response = await axios.post(`${HOST}${path}`, body, config);

            return response;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async putRequest(path, body){
        const token = document.cookie.replace("Authorization=", "");
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            const response = await axios.put(`${HOST}${path}`, body, config);

            return response;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async deleteRequest(path){
        const token = document.cookie.replace("Authorization=", "");
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            const response = await axios.delete(`${HOST}${path}`, config);

            return response;
        } catch (error) {
            console.error('Error:', error);
        }
    }
        
}