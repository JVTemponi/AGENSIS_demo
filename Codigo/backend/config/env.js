require('dotenv').config({ path: '../../.env'});

console.log('Environment Variables Loaded:');
console.log('MYSQL_ROOT_PASSWORD: ', process.env.MYSQL_ROOT_PASSWORD);
console.log('MYSQL_DATABASE: ', process.env.MYSQL_DATABASE);
console.log('MYSQL_USER: ', process.env.MYSQL_USER);
console.log('MYSQL_PASSWORD: ', process.env.MYSQL_PASSWORD);
console.log('DB_HOST: ', process.env.DB_HOST);
console.log('DB_PORT: ', process.env.DB_PORT);
console.log('DB_NAME: ', process.env.DB_NAME);
console.log('DB_USER: ', process.env.DB_USER);
console.log('DB_PASS: ', process.env.DB_PASS);
console.log('SECRET: ', process.env.SECRET);