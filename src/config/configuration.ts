import { join } from "path";

export default () => {
  const dev = {
    app: {
      port: process.env.DEV_APP_PORT || 3000
    },
    db: {
      host: process.env.DEV_DB_HOST || 'localhost',
      port: process.env.DEV_DB_PORT || 27017,
      name: process.env.DEV_DB_NAME || 'cycling_journey_dev'
    },
    cache: {
      host: process.env.DEV_CACHE_HOST || 'localhost',
      port: process.env.DEV_CACHE_PORT || 6379

    }
  }

  const pro = {
    app: {
      port: process.env.PRO_APP_PORT
    },
    db: {
      host: process.env.PRO_DB_HOST,
      port: process.env.PRO_DB_PORT,
      name: process.env.PRO_DB_NAME
    },
    cache: {
      host: process.env.PRO_CACHE_HOST,
      port: process.env.PRO_CACHE_PORT
    }
  }

  const folder = {
    album: join(__dirname + '../../../', 'Server_File/Album').replace(/\\/g, "/"),
    icon: join(__dirname, '../../assets/icon/svg').replace(/\\/g, "/")
  }

  const config = process.env.NODE_ENV === 'pro' ? pro : dev;

  return { ...config, folder };
}