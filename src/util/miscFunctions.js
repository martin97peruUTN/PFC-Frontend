export const pluralizeSpanishWord = word => {
    const char = word.substring(word.length - 1)
    if(char === 'a' || char === 'e' || char === 'i' || char === 'o' || char === 'u') {
        return word + 's';
    } else {
        return word + 'es';
    }
}

export const randomColorGenerator = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}