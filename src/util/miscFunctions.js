import * as constant from './constants'

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

export const parseDateBackToFront = (dateJson) => {
    const dateReturn = new Date(JSON.parse(`"${dateJson}"`));
    return dateReturn;
}

export const parseDateFrontToBack = (date, dateTime) => {
    const dateReturn = new Date(date);
    dateReturn.setHours(dateTime.getHours());
    dateReturn.setMinutes(dateTime.getMinutes());
    return dateReturn.toISOString()
}

export const parseDateToShow = (dateJson) => {
    const date = new Date(JSON.parse(`"${dateJson}"`));
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

export const parseDateTimeToShow = (dateJson) => {
    const date = new Date(JSON.parse(`"${dateJson}"`));
    //Si los minutos son menos de 10, se le agrega un 0 al inicio, sino muestra 14:7 en ves de 14:07
    return `${date.getHours()}:${date.getMinutes()>=10 ? date.getMinutes() : '0'+date.getMinutes()}`
}

export const isSmallScreen = () =>{
    return window.innerWidth<=constant.SMALL_SCREEN_BREAKPOINT
}