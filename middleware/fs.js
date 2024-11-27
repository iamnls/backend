const fs = require('fs');
const path = require('path');


const loadEnv = () => {
    const envPath = path.resolve(__dirname, 'env.json');
    const envConfig = JSON.parse(fs.readFileSync(envPath, 'utf8'));
    
   
    Object.keys(envConfig).forEach(key => {
        process.env[key] = envConfig[key];
    });
};


loadEnv();
