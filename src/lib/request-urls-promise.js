import axios from 'axios';
import isValidUrl from './is-valid-url';
import CustomValidationError from './custom-validation-error';

const requestUrlsPromise = (urls) => {
  return urls.map((url) => {

    if (!isValidUrl(url)) {
      return Promise.reject(new CustomValidationError('Entry is not a valid URL!', 'INVALID_URL', 400, 'Bad Request'));
    }

    return axios.get(url);
  });
};

export default requestUrlsPromise;