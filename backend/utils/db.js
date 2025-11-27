import { Sequelize } from 'sequelize';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || 'development';
const envFile = `.env.${env}`;
const envPath = path.join(__dirname, `../${envFile}`);

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log(`📁 Loaded ${envFile} (${env} environment)`);
} else {
  dotenv.config();
  if (env !== 'development') {
    console.warn(`⚠️  ${envFile} not found, using default .env`);
  } else {
    console.log(`📁 Loaded .env (default)`);
  }
}

let sslConfig = false;
const useSSL = process.env.DB_SSL === 'true' || process.env.DB_SSL === true;

if (useSSL) {
  const certPath = path.join(__dirname, '../certs/ca.pem');
  if (fs.existsSync(certPath)) {
    try {
      sslConfig = {
        require: true,
        rejectUnauthorized: true,
        ca: fs.readFileSync(certPath).toString(),
      };
      console.log('🔒 SSL enabled with certificate');
    } catch (error) {
      console.warn('⚠️  SSL enabled but certificate not found, using without certificate');
      sslConfig = {
        require: true,
        rejectUnauthorized: false,
      };
    }
  } else {
    console.warn('⚠️  SSL enabled but certificate not found at:', certPath);
    sslConfig = {
      require: true,
      rejectUnauthorized: false,
    };
  }
}

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  dialectOptions: {
    ...(sslConfig && { ssl: sslConfig }),
  },
});

sequelize.authenticate()
  .then(() => {
    console.log('✅ Successfully connected to Aiven PostgreSQL database');
  })
  .catch((error) => {
    console.error('❌ Unable to connect to database:', error.message);
  });

export default sequelize;