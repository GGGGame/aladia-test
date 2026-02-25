export const configuration = () => {
  const isRequired = (value: string | undefined, key: string) => {
    if (!value) {
      throw new Error(`${key} is required`);
    }
    return value;
  };
  return {
    mongodbHost: isRequired(process.env.MONGODB_HOST, 'MONGODB_HOST'),
    mongodbPort: process.env.MONGODB_PORT || '27017',
    mongodbDatabase: isRequired(
      process.env.MONGODB_DATABASE,
      'MONGODB_DATABASE',
    ),
    mongodbUser: isRequired(process.env.MONGODB_USER, 'MONGODB_USER'),
    mongodbPassword: isRequired(
      process.env.MONGODB_PASSWORD,
      'MONGODB_PASSWORD',
    ),
    gatewayPort: isRequired(process.env.GATEWAY_PORT, 'GATEWAY_PORT'),
    authenticationPort: isRequired(
      process.env.AUTHENTICATION_PORT,
      'AUTHENTICATION_PORT',
    ),
    listenHost: process.env.LISTEN_HOST || '0.0.0.0',
    authHost: process.env.AUTH_HOST || 'authentication',
  };
};
