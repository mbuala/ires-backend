const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'uploads')
    },
    filename: (req, file, callBack) => {
        callBack(null,file.originalname)
    }
  })

  const uploadFile = multer({ storage: storage })


module.exports = uploadFile;