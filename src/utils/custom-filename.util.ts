export const customFileName = (req, file, callback) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 100);
  const baseName = file.fieldname.replace(/\s+/g, '_').toLowerCase();
  const fileName = `${baseName}-${uniqueSuffix}-${file.originalname}`;
  if (callback) {
    callback(null, fileName);
  } else {
    return fileName;
  }
};
