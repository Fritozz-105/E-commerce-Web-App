import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://us-central1-project-20e2f.cloudfunctions.net/api'
});

export default instance;