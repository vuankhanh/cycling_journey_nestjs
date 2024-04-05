import { join } from "path";

export default () => {
  const dev = {
    app: {
      port: Number(process.env.DEV_APP_PORT) || 3000
    },
    db: {
      host: process.env.DEV_DB_HOST || 'localhost',
      port: Number(process.env.DEV_DB_PORT) || 27017,
      name: process.env.DEV_DB_NAME || 'cycling_journey_dev'
    },
    cache: {
      host: process.env.DEV_CACHE_HOST || 'localhost',
      port: Number(process.env.DEV_CACHE_PORT) || 6379
    },
    storage: {
      protocol: process.env.DEV_STORAGE_PROTOCOL || 'http',
      host: process.env.DEV_STORAGE_HOST || 'localhost',
      port: Number(process.env.DEV_STORAGE_PORT) || 3105,
      userName: process.env.DEV_STORAGE_USERNAME || 'admin',
      password: process.env.DEV_STORAGE_PASSWORD
    }
  }

  const pro = {
    app: {
      port: Number(process.env.PRO_APP_PORT)
    },
    db: {
      host: process.env.PRO_DB_HOST,
      port: Number(process.env.PRO_DB_PORT),
      name: process.env.PRO_DB_NAME
    },
    cache: {
      host: process.env.PRO_CACHE_HOST,
      port: Number(process.env.PRO_CACHE_PORT)
    },
    storage: {
      protocol: process.env.PRO_STORAGE_PROTOCOL,
      host: process.env.PRO_STORAGE_HOST,
      port: Number(process.env.PRO_STORAGE_PORT),
      userName: process.env.PRO_STORAGE_USERNAME,
      password: process.env.PRO_STORAGE_PASSWORD
    }
  }

  const folder = {
    album: join(__dirname + '../../..', process.env.FILE_FOLDER, 'Album').replace(/\\/g, "/"),
    icon: join(__dirname, '../../assets/icon/svg').replace(/\\/g, "/")
  }

  const config = process.env.NODE_ENV?.trim() === 'pro' ? pro : dev;

  return { ...config, folder };
}