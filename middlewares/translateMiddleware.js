//dès qu'il voit une clé qui finit par "_trad", il traduit la valeur associée
const initTranslation = require('../lib/i18next.js');

// Mappings des champs traduisibles par modèle
const translatableFieldsByModel = {
  'Category': ['name'],
  'Book': ['name'],
  'Author': [], // Les auteurs n'ont pas de champs traduisibles pour l'instant
  'User': []    // Les utilisateurs n'ont pas de champs traduisibles pour l'instant
};

// Fonction pour traduire automatiquement les objets selon les champs déclarés
function translateObject(obj, translateFn) {
  if (!obj) return obj;
  
  // Convertir les objets Sequelize en JSON
  let cleanObj = obj;
  if (obj.dataValues) {
    cleanObj = obj.dataValues;
  } else if (obj.toJSON && typeof obj.toJSON === 'function') {
    cleanObj = obj.toJSON();
  }
  
  const translatedObj = Array.isArray(cleanObj) ? [...cleanObj] : { ...cleanObj };
  
  if (Array.isArray(translatedObj)) {
    return translatedObj.map(item => translateObject(item, translateFn));
  }
  
  // Déterminer le type de modèle à partir de la structure de l'objet
  let modelType = null;
  if (translatedObj.constructor && translatedObj.constructor.name !== 'Object') {
    modelType = translatedObj.constructor.name;
  } else if (translatedObj.name && translatedObj.description) {
    modelType = 'Category';
  } else if (translatedObj.name && translatedObj.date_of_publication) {
    modelType = 'Book';
  } else if (translatedObj.firstName && translatedObj.lastName) {
    modelType = 'Author';
  } else if (translatedObj.username) {
    modelType = 'User';
  }
  
  // Traduire les champs selon le type de modèle
  if (modelType && translatableFieldsByModel[modelType]) {
    translatableFieldsByModel[modelType].forEach(field => {
      if (translatedObj[field]) {
        const translatedValue = translateFn(translatedObj[field]);
        if (translatedValue && translatedValue !== translatedObj[field]) {
          translatedObj[`${field}_translated`] = translatedValue;
        }
      }
    });
  }
  
  // Traduire les relations imbriquées
  Object.keys(translatedObj).forEach(key => {
    if (translatedObj[key] && typeof translatedObj[key] === 'object' && !Array.isArray(translatedObj[key]) && !(translatedObj[key] instanceof Date)) {
      translatedObj[key] = translateObject(translatedObj[key], translateFn);
    } else if (Array.isArray(translatedObj[key])) {
      translatedObj[key] = translatedObj[key].map(item => translateObject(item, translateFn));
    }
  });
  
  return translatedObj;
}

module.exports = function translateMiddleware (req, res, next) {
  console.log("Translate middleware");
  res.trad = initTranslation(req);
  res.setHeader('Content-Language', req.language);
  
  // Ajouter une fonction pour appliquer les traductions
  res.applyTranslations = function(data) {
    return translateObject(data, res.trad);
  };
  
  next();
};

