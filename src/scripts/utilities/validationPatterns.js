const validationPatterns = {
  usernamePattern: '^[a-zA-Z0-9_ ]{3,12}$',
  emailPattern: '^([a-zA-Z0-9_.-]+)@([a-zA-Z0-9_.-]+).([a-zA-Z]{2,5})$',
  passwordPattern: '[a-zA-Z0-9_ ]{8,30}',
  titlePattern: '^.{1,50}$',
  deadlinePattern: '^[0-9]{4}-[0-9]{2}-[0-9]{2}$',
};

export default validationPatterns;
