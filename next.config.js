module.exports = {
  /* config options here */
  serverRuntimeConfig: {
    // Will only be available on the server side
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    nodeEnv: process.env.NODE_ENV,
    frontendUrl: process.env.FRONTEND_URL,
    apiUrl: process.env.API_URL,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    discourseForumUrl: process.env.DISCOURSE_FORUM_URL,
    discordInviteLink: process.env.DISCORD_INVITE_LINK,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretKey: process.env.AWS_SECRET_KEY,
    awsRegion: process.env.AWS_REGION,
  },
};
