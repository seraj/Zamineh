
class Localsetting {
    static getConfig = function () {

        const config = {
            baseUrl: "https://zamineh.net/",
            testComp: true,
            apiUrl: 'https://api.zamineh.net/'

        }

        // if (window.location.href.includes(':8001/')) {

        //     config.baseUrl = 'https://api.zamineh.net/';
        // }

        // else {
        //     config.baseUrl = 'https://apizamineh.net';
        // }


        return config;
    }





}

export default Localsetting;
