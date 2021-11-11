const pluralizeSpanishWord = word => {
    const char = word.substring(word.length - 1)
    if(char === 'a' || char === 'e' || char === 'i' || char === 'o' || char === 'u') {
        return word + 's';
    } else {
        return word + 'es';
    }
}
export default pluralizeSpanishWord