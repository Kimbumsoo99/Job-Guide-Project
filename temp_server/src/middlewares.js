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
