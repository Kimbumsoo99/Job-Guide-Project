export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.user = req.session.user || {};
    next();
};

export const protectorMiddleware = (req, res, next) => {
    if (req.session.loggedIn) {
        return next();
    } else {
        return res.redirect("/login");
    }
};

export const checkVRealInfoMiddleware = (req, res, next) => {
    if (!req.session.user.vsphere) {
        return res.redirect("/vs");
    }
    if (req.session.user.vsphere.v_real) {
        return next();
    } else {
        return res.redirect("/vs/add/real");
    }
};

export const notServerURLMiddleware = (req, res, next) => {
    if (req.url !== "/") {
        res.status(404).render("error", {
            errorName: "404",
            errorMsg: "404 Not Found",
        });
        return;
    }
    next();
};

export const serverErrorMiddleware = (err, req, res, next) => {
    res.status(500).render("error", {
        errorName: "500",
        errorMsg: "Internal Server Error",
    });
};
