export function sanitizeAndTruncateText(htmlText: string, maxLength: number, dots: boolean) {
  if (!htmlText) return;
  const plainText = htmlText.replace(/<\/?[^>]+(>|$)/g, ' ');

  // const words = plainText.split(/\s+/);

  let truncatedWords = plainText.slice(0, maxLength);
  if (truncatedWords.charAt(maxLength - 1) === ' ') {
    truncatedWords = truncatedWords.slice(0, maxLength - 1);
  }
  let showDots = plainText.split('').length > maxLength && dots;
  const truncatedText = truncatedWords + (showDots ? '...' : '');

  return truncatedText;
}

export const getQuotationType = async(userId: string | number) =>{
  return "smart";
}
 
export function getWeekDates() {
  const currentDate = new Date();
  const currentDay = currentDate.getDay(); // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)

  // Calculate the start date of the week (Sunday)
  const startDate = new Date(currentDate);
  startDate.setDate(currentDate.getDate() - currentDay);

  // Create an array to store the dates of the week
  const weekDates = [];

  // Iterate through the week and populate the array with dates
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    weekDates.push(date);
  }

  return weekDates;
}

export function deepObjectsToStrings(obj: any): any {
  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      return obj.map(deepObjectsToStrings);
    } else if (obj === null) {
      return obj;
    } else {
      const result: { [key: string]: any } = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          result[key] = deepObjectsToStrings(obj[key]);
        }
      }
      return result;
    }
  } else {
    return obj.toString();
  }
}