const asyncHandler = (fn) => (req, res, next) => Promise.resolve((fn(req, res, next))).catch(next)
module.exports = asyncHandler

// In a effort to never have to create another try catch lock or have to copy and paste it we have created a wrapper function