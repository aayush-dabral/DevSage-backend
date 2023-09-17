const checkAdmin = (req, res, next) => {
    try{
        if(req.user.roles!=='ADMIN'){
            return res.status(401).send("Admin level access required")
        }
        next();

    } catch (errro){
        res.status(401).send("Something went wrong");
    }
}

module.exports = checkAdmin