Date.prototype.getWeek = function () {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
};

export const getCurrentWeekNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    let weekNumber = date.getWeek();
    weekNumber = weekNumber > 9 ? weekNumber : `0${weekNumber}`;
    return `${year}${weekNumber}`;
}

export const getEventDate = () => {
    const today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1; //January is 0!
    const year = today.getFullYear();
    day = day > 9 ? day : `0${day}`;
    month = month > 9 ? month : `0${month}`;
    return `${year}-${month}-${day}`
}

export const getRandomCharacters = (length) => {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}