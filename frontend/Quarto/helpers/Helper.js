
export default class Fetch {
    
    // static Base_URL="http://192.168.43.67:3001/"
    static Base_URL="http://predot.xyz:3001/"

    static post(url, body) {
        return new Promise((resolve, reject) => {
            fetch(this.Base_URL+url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }).then(res => res.json()).then(json => {
                resolve(json);
            })
        });
    }
    static post(url, body, token) {
        return new Promise((resolve, reject) => {
            fetch(this.Base_URL+url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, 
                },
                body: JSON.stringify(body)
            }).then(res => res.json()).then(json => {
                resolve(json);
            })
        });
        
    }
}