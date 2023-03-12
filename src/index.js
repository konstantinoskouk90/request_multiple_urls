import * as polyfill from 'babel-polyfill';
import axios from 'axios';
import CustomValidationError from './lib/custom-validation-error';
import requestUrlsPromise from './lib/request-urls-promise';

const requestMultipleUrls = async (urls) => {

  // General input validation error for when not an array
  if (!Array.isArray(urls)) {
    throw new CustomValidationError('Input must be of type array!', 'INPUT_MUST_BE_OF_TYPE_ARRAY', 400, 'Bad Request');
  }

  // General input validation error for when the array is empty
  if (!urls.length) {
    throw new CustomValidationError('Input array cannot be empty!', 'INPUT_ARRAY_CANNOT_BE_EMPTY', 400, 'Bad Request');
  }

  const result = await Promise.allSettled(requestUrlsPromise(urls));

  return result;
};

module.exports = requestMultipleUrls;