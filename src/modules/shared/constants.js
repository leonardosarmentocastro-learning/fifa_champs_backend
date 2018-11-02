// DATE TOKENS
const dayOfWeek = 'EEEE';
const dayOfMonth = 'dd';
const monthUnabbreviated = 'MMMM';
const fourDigitYear = 'yyyy';

const SHARED_CONSTANTS = {
  DATE_FORMAT: {
    COMPLETE: `${dayOfWeek}, ${dayOfMonth} 'de' ${monthUnabbreviated} ${fourDigitYear}`,
  },
};

module.exports = SHARED_CONSTANTS;
