export default () => ({
    nasaApiKey: process.env.NASA_API_KEY,
    nasaEpicBaseUrl: process.env.NASA_EPIC_BASE_URL,
    nasaEpicImageUrl: process.env.NASA_EPIC_IMAGE_URL,
    port: parseInt(process.env.PORT || '3001', 10)
}); 