export const cleanKeyword = (kw: string, allowAsterisk = false, removeScapeChar = false): string => {
  if (kw.trim() === '') {
    return '';
  }

  let newKw;

  if (allowAsterisk) {
    newKw = kw
      .trim()
      .toLowerCase()
      .replace(/'s /g, '')
      .replace(/[^a-z\d-'\s*\\]/gi, '')
      .replace(/\s+/gi, ' ');
  } else {
    newKw = kw
      .trim()
      .toLowerCase()
      .replace(/'s /g, '')
      .replace(/[^a-z\d-'\s\\]/gi, '')
      .replace(/\s+/gi, ' ');
  }

  if (removeScapeChar) {
    newKw = newKw.replace(/\\/g, '');
  }

  return newKw;
};

export const cleanKeywordYears = (sug: string) => {
  if (new RegExp(/\b2021\b/gi).test(sug)) {
    return sug.replace('2021', '2022');
  } else if (new RegExp(/\b2020\b/gi).test(sug)) {
    return sug.replace('2020', '2022');
  }
  return sug;
};

const KEYWORD_COMMON_FILTER = [/\shindi$/, /\sindia$/, /\spakistan$/, /\suk$/, /\ssri lanka$/];

export const filterCommonKeywords = (seed: string) => (kw: string) => {
  for (const common of KEYWORD_COMMON_FILTER) {
    const reg = new RegExp(common);
    if (reg.test(seed)) {
      return true;
    }

    if (reg.test(kw)) {
      return false;
    }
  }

  return true;
};
