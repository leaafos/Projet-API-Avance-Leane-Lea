const Papa = require("papaparse");  
const xml2js = require("xml2js");

module.exports = (req, res, next) => {
    res.render = function (data) {
        // Appliquer les traductions automatiques si disponibles
        let processedData = data;
        if (res.applyTranslations) {
            processedData = res.applyTranslations(data);
        }
        
        const items = Array.isArray(processedData) ? processedData : [processedData];
        const name = items[0].constructor && items[0].constructor.name ? items[0].constructor.name.toLowerCase() : 'item'; 
        res.format({
            'text/csv' () {
                const csv = Papa.unparse(items.map((item) => item.dataValues || item));
                res.setHeader('Content-type', 'text/csv');
                res.send(csv);
            },
            'text/xml': () => {
                const builder = new xml2js.Builder();
                const xml = builder.buildObject({[name + "s"]: items.map((item) => ({[name]: item.dataValues || item}))});
                res.setHeader('Content-type', 'text/xml');
                res.send(xml);
            },
            'application/xml': () => {
                const builder = new xml2js.Builder();
                const xml = builder.buildObject({[name + "s"]: items.map((item) => ({[name]: item.dataValues || item}))});
                res.setHeader('Content-type', 'application/xml');
                res.send(xml);
            },
            default() {
                res.json(processedData);
            }
        });
    };
    next();
};