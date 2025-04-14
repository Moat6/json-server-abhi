const jsonServer = require("json-server");
const server = jsonServer.create();
const fs = require("fs");
const path = require("path");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 8080;

const json = JSON.parse(fs.readFileSync(path.join(__dirname, "db.json"), "utf8"));

const router = jsonServer.router({
    statusInfo: { value: json.status },
    dataInfo: json.data,
    messageInfo: { value: json.message },
    activityInfo: json.activity,
});

server.use(middlewares);

server.use((req, res, next) => {
    router.render = (req, res) => {
        let resource = res.locals.data;

        if (req.path === "/") {
            res.jsonp({
                status: json.status,
                data: json.data,
                message: json.message,
                activity: json.activity,
            });
        } else {
            res.jsonp(resource);
        }
    };
    next();
});

server.use(router);

server.listen(port, () => {
    console.log(`JSON Server is running on port ${port}`);
});
