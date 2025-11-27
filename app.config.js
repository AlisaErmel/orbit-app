import 'dotenv/config';

export default ({ config }) => ({
    ...config,
    extra: {
        googleBooksApiKey: process.env.GOOGLE_BOOKS_API_KEY,
    },
});
