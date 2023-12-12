const moment = require("moment");

const dateTimeMiddleware = (req, res, next) => {
    let formatDates = {
        starDate: req.body.startDate,
        endDate: req.body.endDate
    };

    for (const date in formatDates) {
        if (formatDates[date]) {
            // Vérifie si une heure est indiquée dans les dates envoyées
            if (formatDates[date].includes(':')) formatDates[date] = moment(formatDates[date], "YYYY-MM-DD HH:mm:ss");
            // Afin d'adapter le format des dates 
            else formatDates[date] = moment(formatDates[date], "YYYY-MM-DD");
            formatDates[date] = formatDates[date].format("YYYY-MM-DD HH:mm:ss");
        }
    }

    // On réaffecte les dates formatées
    if (formatDates.starDate || formatDates.endDate) {
        req.body.startDate = formatDates.starDate;
        req.body.endDate = formatDates.endDate;
    }
    next();
}

module.exports = dateTimeMiddleware;