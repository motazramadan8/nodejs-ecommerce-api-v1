const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerOptions = () => {
  const multerFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Not supported file, only images allowed", 400), false);
    }
  };

  const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: multerFileFilter,
  });

  return upload;
};

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

exports.uploadMixOfImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);
