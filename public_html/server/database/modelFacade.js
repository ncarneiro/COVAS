

var mongoose = require("mongoose");
var fs = require("fs");


var User = {
    findUserByEmail: function (email, props, callback) {

        if (typeof props === 'string') {

            if (props.indexOf("." >= 0)) {
                //Deep populate
                global.database.models.User
                        .findOne({email: email})
                        .deepPopulate(props)
                        .exec(function (err, user) {
                            if (err) {
                                console.log("erro ao popular projetos do usuário");
                            }
                            //console.log(usuario);
                            callback(user);
                        });
            } else {
                global.database.models.User.findOne({email: email}, props, function (err, user) {
                    if (err) {
                        console.log("erro ao ler usuário na base de dados.");
                    } else {
                        callback(user);
                    }
                });
            }
        } else if (typeof props === 'function') {
            global.database.models.User.findOne({email: email}, function (err, user) {
                if (err) {
                    console.log("erro ao ler usuário na base de dados.");
                } else {
                    props(user.toObject());
                }
            });
        }

    },
    parseUserToTree: function (usuario) {
        var projetos = [];
        for (var i = 0; i < usuario._workspaces.length; i++) {
            projetos.push({});
            projetos[i].text = usuario._workspaces[i].name;
            projetos[i].iconCls = "icon-project";
            projetos[i].id = "w_" + usuario._workspaces[i]._id.toString();
            projetos[i].attributes = {
                id: usuario._workspaces[i]._id.toString(),
                type: "workspace"
            };
            projetos[i].children = [];
            for (var j = 0; j < usuario._workspaces[i]._databases.length; j++) {
                var baseaux = usuario._workspaces[i]._databases[j];
                projetos[i].children.push({});
                projetos[i].children[j].text = baseaux.name;
                projetos[i].children[j].id = "d_" + baseaux._id.toString();
                projetos[i].children[j].iconCls = "icon-database";
                projetos[i].children[j].attributes = {
                    id: baseaux._id.toString(),
                    type: "database"
                };
                projetos[i].children[j].children = [];

                for (var k = 0; k < baseaux._visualizations.length; k++) {
                    projetos[i].children[j].children.push({});
                    projetos[i].children[j].children[k].text = baseaux._visualizations[k].name;
                    projetos[i].children[j].children[k].id = "v_" + baseaux._visualizations[k]._id.toString();
                    projetos[i].children[j].children[k].iconCls = "icon-visualization";
                    projetos[i].children[j].children[k].attributes = {
                        id: baseaux._visualizations[k]._id.toString(),
                        type: "visualization"
                    };
                }
            }
        }
        var projetosCompartilhados = [];
        for (var i = 0; i < usuario._sharedWorkspaces.length; i++) {
            projetosCompartilhados.push({});
            projetosCompartilhados[i].text = usuario._sharedWorkspaces[i].name;
            projetosCompartilhados[i].iconCls = "icon-project";
            projetosCompartilhados[i].children = [];
            for (var j = 0; j < usuario._sharedWorkspaces[i]._databases.length; j++) {
                var baseaux = usuario._sharedWorkspaces[i]._databases[j];
                projetosCompartilhados[i].children.push({});
                projetosCompartilhados[i].children[j].text = baseaux.name;
                projetosCompartilhados[i].children[j].iconCls = "icon-database";
                projetosCompartilhados[i].children[j].children = [];

                for (var k = 0; k < baseaux._visualizations.length; k++) {
                    projetosCompartilhados[i].children[j].children.push({});
                    projetosCompartilhados[i].children[j].children[k].text = baseaux._visualizations[k].name;
                    projetosCompartilhados[i].children[j].children[k].iconCls = "icon-visualization";
                }
            }
        }
        if (projetosCompartilhados.length === 0)
            projetosCompartilhados.push({
                text: "Vazio",
                iconCls: "icon-blank"
            });

        return [
            {text: "Meus Projetos", children: projetos,
                attributes: {type: "myworkspaces"}
            },
            {text: "Projetos Compartilhados",
                children: projetosCompartilhados,
                attributes: {type: "sharedworkspaces"}
            }
        ];
    },
    getItemData: function (itemData, userEmail, callback) {

        var returnData = {};
        itemData.id = mongoose.Types.ObjectId(itemData.id);
        switch (itemData.type) {
            case "myworkspaces":
                global.database.models.User
                        .findOne({email: userEmail})
                        .populate("_workspaces", "name _id")
                        .exec(function (err, user) {
                            if (err) {
                                console.log("erro ao buscar usuário.");
                            } else {
                                returnData.itens = [];
                                Array.prototype.push.apply(returnData.itens, user._workspaces);
                                returnData.breadcrumb = [];
                                returnData.name = "Meus Projetos";
                                callback(returnData);
                            }
                        });
                break;
            case "workspace":
                global.database.models.Workspace
                        .findOne({_id: itemData.id})
                        .populate("_databases", "name _id")
                        .exec(function (err, workspace) {
                            if (err) {
                                console.log("erro ao buscar usuário.");
                            } else {
                                returnData.itens = [];
                                Array.prototype.push.apply(returnData.itens, workspace._databases);
                                returnData.breadcrumb = ["Meus Projetos"];
                                returnData.name = workspace.name;
                                callback(returnData);
                            }
                        });
                break;
            case "database":
                global.database.models.Database
                        .findOne({_id: itemData.id})
                        .populate("_visualizations", "name _id")
                        .populate("_workspace", "name")
                        .exec(function (err, database) {
                            if (err) {
                                console.log("erro ao buscar usuário.");
                            } else {
                                returnData.itens = [];
                                Array.prototype.push.apply(returnData.itens, database._visualizations);
                                returnData.breadcrumb = ["Meus Projetos", database._workspace.name];
                                returnData.name = database.name;
                                callback(returnData);
                            }
                        });
                break;
            case "visualization":
                global.database.models.Visualization
                        .findOne({_id: itemData.id})
                        .populate("_database", "name _id")
                        .populate("_workspace", "name _id")
                        .exec(function (err, vis) {
                            if (err) {
                                console.log("erro ao buscar usuário.");
                            } else {
                                returnData.itens = [];
                                //implementar histórico da visualização.
                                returnData.breadcrumb = ["Meus Projetos", vis._workspace.name, vis._database.name];
                                returnData.name = vis.name;
                                callback(returnData);
                            }
                        });
                break;
        }
    }
};
exports.User = User;

var Workspace = {
    createNewEmptyWorkspace: function (name, userEmail, callback) {
        global.database.models.User.findOne({email: userEmail}, function (err, user) {
            if (err) {
                console.log("usuário não encontrado");
            } else {
                var novoProjeto = global.database.models.Workspace({name: name, _owner: user._id});
                user._workspaces.push(novoProjeto._id);

                novoProjeto.save(function (err) {
                    if (!err) {
                        user.save(function (err) {
                            if (!err) {
                                callback(user, novoProjeto);
                            }
                        });
                    }
                });
            }
        });
    },
    removeWorkspace: function (id, email, callback) {
        global.database.models.Workspace
                .findOne({_id: id})
                .populate("_owner", "email")
                .exec(function (err, workspace) {
                    if (!err) {
                        if (workspace._owner.email === email) {
                            console.log("excluir permitido.");
                            workspace.remove();
                            callback(true);
                        }
                    }
                });
    }
};
exports.Workspace = Workspace;


var Database = {
    createNewDatabase: function (name, dataDir, workspaceId, userEmail, callback) {
        global.database.models.Workspace
                .findOne({_id: mongoose.Types.ObjectId(workspaceId)})
                .populate("_owner", "email")
                .exec(function (err, workspace) {
                    if (!err && workspace._owner.email === userEmail) {

                        fs.readFile(dataDir, {encoding: "utf8"}, function (err, data) {
                            if (!err) {

                                //
                                var columnsName = data.split("\n")[0].split("\t");
                                columnsName[columnsName.length - 1].replace("\r", "");

                                var database = new global.database.models.Database({
                                    name: name,
                                    columnsName: columnsName,
                                    _workspace: workspace._id,
                                    dataDir: dataDir
                                });
                                workspace._databases.push(database._id);
                                database.save(function (err) {
                                    if (!err) {
                                        workspace.save(function (err) {
                                            if (!err) {
                                                console.log("dois workspaces salvos");
                                                callback(true);
                                            }
                                        });
                                    }
                                });
                            } else {
                                throw err;
                            }
                        });
                    }
                });
    },
    readDataOf: function (databaseId, callback) {
        global.database.models.Database.findOne({_id: databaseId}, function (err, database) {
            if (!err) {
                fs.readFile(database.dataDir, {encoding: "utf8"}, function (err, data) {
                    if (!err) {
                        //Fazer tratamento de dados fora deste módulo.
                        var lines = data.split("\n"), d = [];
                        for (var i = 1; i < lines.length; i++) {
                            if (lines[i].trim() !== "") {
                                var cols = lines[i].split("\t");
                                cols[cols.length - 1] = cols[cols.length - 1].replace("\r", "");
                                d.push(cols);
                            }
                        }
                        for (var j = 0; j < d[0].length; j++) {
                            var type = "string";
                            for (var i = 0; i < d.length; i++) {
                                if (type !== "string") {
                                    if (!(type === "number" && /^(-)?\d+(\.\d+)?$/.test(d[i][j]))) {
                                        type = "string";
                                        break;
                                    }
                                } else if (/^(-)?\d+(\.\d+)?$/.test(d[i][j])) {
                                    type = "number";
                                }
                                if (type === "number") {
                                    for (var i = 0; i < d.length; i++) {
                                        d[i][j] = parseFloat(d[i][j]);
                                    }
                                }
                            }
                        }

                        callback(d);
                    } else {
                        throw err;
                    }
                });
            } else {
                console.log(err);
            }
        });
    }
};
exports.Database = Database;


var Visualization = {
    createNewVisualization: function (name, tech, databaseId, userEmail, callback) {

        global.database.models.Database
                .findOne({_id: mongoose.Types.ObjectId(databaseId)})
                .deepPopulate("_workspace._owner")
                .exec(function (err, database) {
                    if (!err && database._workspace._owner.email === userEmail) {


                        Database.readDataOf(database._id, function (data) {

                            var vis = global.database.models.Visualization({
                                name: name,
                                technique: tech,
                                _database: database._id,
                                _workspace: database._workspace._id,
                                state: {data: data},
                                history: []
                            });
                            database._visualizations.push(vis._id);

                            database.save(function (err) {
                                if (!err) {
                                    vis.save(function (err) {
                                        if (!err) {
                                            callback(true);
                                        } else {
                                            console.log(err);
                                        }
                                    })
                                } else {
                                    console.log(err);
                                }
                            });


                        });

                    } else {
                        console.log("usuário não autenticado");
                        callback(false);
                    }
                });
    },
    getVisualization: function (visId, userEmail, callback) {
        global.database.models.Visualization
                .findOne({_id: mongoose.Types.ObjectId(visId)})
                .deepPopulate("_workspace._owner")
                .populate("_database", "columnsName")
                .exec(function (err, visualization) {
                    if (err)
                        throw err;

                    if (visualization._workspace._owner.email === userEmail) {
                        var visObj = {
                            id: visualization._id,
                            state: visualization.state,
                            columnsName: visualization._database.columnsName,
                            name: visualization.name,
                            technique: visualization.technique
                        };
                        callback(visObj);
                    } else {
                        callback(false);
                    }

                });
    }
};
exports.Visualization = Visualization;
