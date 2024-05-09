export const calculateMinuteRead = (content: string) => {
    if(!content) return 0;
    const wordsPerMinute = 200; // Adjust this value as needed
    const wordCount = content.split(/\s+/).length;
    const minuteRead = Math.ceil(wordCount / wordsPerMinute);
    return minuteRead;
}
