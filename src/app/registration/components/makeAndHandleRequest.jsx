
import axios from 'axios';
import Urls from "../../components/Urls";


export default function makeAndHandleRequest(api, query) {
    return axios.get(`${Urls().api()}${api}=${query}`)
        .then((response) => {
            const total_count = response.data.count
            const options = response.data.items.map((i) => ({
                slug: i.slug,
                id: i.id,
                name: i.name,
            }));
            // console.log('options', options)
            return { options, total_count };
        });
}