export interface IHttpErrorShape {
  response?: {
    data?: {
      error?: {
        message?: string;
      };
      message?: string;
    };
  };
}
