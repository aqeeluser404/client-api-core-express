
const allowedOrigins = [
    process.env.FRONTEND_DEV || 'http://localhost:9000',
    process.env.FRONTEND_LIVE
].filter(Boolean)

const corsOptions = {
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    credentials: true
}

export default corsOptions