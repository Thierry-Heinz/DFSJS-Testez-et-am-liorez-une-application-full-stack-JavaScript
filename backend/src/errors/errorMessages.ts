export const ErrorMessage = {
  //SESSION
  SESSION_ID_REQUIRED: {
    statusCode: 400,
    message: 'Session ID is required',
  },
  INVALID_SESSION_ID: {
    statusCode: 400,
    message: 'Invalid session ID',
  },
  NAME_REQUIRED: {
    statusCode: 400,
    message: 'Name is required',
  },
  DATE_REQUIRED: {
    statusCode: 400,
    message: 'Date is required',
  },
  DESCRIPTION_REQUIRED: {
    statusCode: 400,
    message: 'Description is required',
  },

  //USER
  USER_ID_REQUIRED: {
    statusCode: 400,
    message: 'User ID is required',
  },
  INVALID_USER_ID: {
    statusCode: 400,
    message: 'Invalid user ID',
  },
  USER_NOT_FOUND: {
    statusCode: 404,
    message: 'User not found',
  },

  //TEACHER
  TEACHER_ID_REQUIRED: {
    statusCode: 400,
    message: 'Teacher ID is required',
  },
  SESSION_NOT_FOUND: {
    statusCode: 404,
    message: 'Session not found',
  },
  TEACHER_NOT_FOUND: {
    statusCode: 404,
    message: 'Teacher not found',
  },
  INVALID_TEACHER_ID: {
    statusCode: 400,
    message: 'Invalid teacher ID',
  },

  //PARTICIPATION
  PARTICIPATION_NOT_FOUND: {
    statusCode: 404,
    message: 'Participation not found',
  },
  ALREADY_PARTICIPATING: {
    statusCode: 409,
    message: 'User already participating in this session',
  },

  //ADMIN
  ADMIN_REQUIRED: {
    statusCode: 403,
    message: 'Admin access required',
  },
  ADMIN_SELF_PROMOTION_DEV_ONLY: {
    statusCode: 403,
    message: 'Admin self-promotion is only available in development',
  },
  DELETE_OWN_ACCOUNT_ONLY: {
    statusCode: 403,
    message: 'You can only delete your own account',
  },

  //AUTH
  UNAUTHORIZED: {
    statusCode: 401,
    message: 'Unauthorized',
  },
  EMAIL_ALREADY_EXISTS: {
    statusCode: 409,
    message: 'Email already exists',
  },
  INVALID_CREDENTIALS: {
    statusCode: 401,
    message: 'Invalid Credentials',
  },
};
