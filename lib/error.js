class HttpError extends Error {
  constructor(message, status) {
    super(message);

    this.message = message;
    this.status = status;
  }

  json() {
    return {
      message: this.message,
      status: this.status,
    };
  }
}

module.exports = HttpError;
