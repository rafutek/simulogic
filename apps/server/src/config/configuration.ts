export const configuration = () => {
    console.log(process.env.NODE_ENV)
    return {
        environment: process.env.NODE_ENV || "development",
        port: process.env.PORT || 8080
    }
}