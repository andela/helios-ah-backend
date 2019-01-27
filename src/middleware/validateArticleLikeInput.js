
const validateLikeValue = (req, res, next) => {
  const { isLiked } = req.body;
  if ((isLiked === true) || (isLiked === false) || (isLiked === undefined)) {
    next();
  } else {
    return res.status(404).json(
      {
        success: false,
        message: 'Invalid like value'
      }
    );
  }
};

export default validateLikeValue;
