export default () => ({
    port: parseInt(process.env.PORT || "3000", 10),
    database: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/backend',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'defaultsecret',
        expiresIn: '1d',
    },
});