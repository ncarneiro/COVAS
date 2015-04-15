

var mongoose = require("mongoose");

exports.User = {
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
            projetos[i].attributes = {
                id: usuario._workspaces[i]._id.toString(),
                type: "workspace"
            };
            projetos[i].children = [];
            for (var j = 0; j < usuario._workspaces[i]._databases.length; j++) {
                var baseaux = usuario._workspaces[i]._databases[j];
                projetos[i].children.push({});
                projetos[i].children[j].text = baseaux.name;
                projetos[i].children[j].iconCls = "icon-database";
                projetos[i].children[j].attributes = {
                    id: baseaux._id.toString(),
                    type: "database"
                };
                projetos[i].children[j].children = [];

                for (var k = 0; k < baseaux._visualizations.length; k++) {
                    projetos[i].children[j].children.push({});
                    projetos[i].children[j].children[k].text = baseaux._visualizations[k].name;
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
            {text: "Meus Projetos", state: "closed", children: projetos, 
                attributes: {type: "myworkspaces"}
            },
            {text: "Projetos Compartilhados", 
                state: "closed", 
                children: projetosCompartilhados,
                attributes: {type: "sharedworkspaces"}
            }
        ];
    },
    getItemData: function(itemData, callback){
        
    }
};


exports.Workspace = {
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
