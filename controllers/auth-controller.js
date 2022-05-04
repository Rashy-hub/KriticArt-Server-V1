//const db = require('../models'); replace with mongoose schema
const bcrypt = require('bcrypt');
const UserModel=require('../models/users-model')
//replace Op object (sequalize) with mongooose
const { ErrorResponse } = require('../response-schemas/error-schema');
const { generateJWT } = require('../utils/jwt-utils');

const authController = {

    register: async (req, res) => {
        // Recuperation des données
        const { username, email } = req.validatedData;
       
        // Hashage du mot de passe à l'aide de "bcrypt"
        const password = await bcrypt.hash(req.validatedData.password, 10);

        // Création du compte en base de données
        
        // Create an instance of model SomeModel
        const newuser = new UserModel({username, email ,password});
        //   Génération d'un « Json Web Token »
        const token = await generateJWT({
            id: newuser._id,
            pseudo: newuser.username,
            isAdmin: newuser.isAdmin
        }); 

        //save data
        await newuser.save(function (err) {
            if (err) 
            {   
                return res.status(422).json(new ErrorResponse('Bad credential ' + err, 422));
            }
           
            // Envoi du token
            res.json(token);
            console.log( username +" has been registred in database")
            // saved!
          });
   

      


        
    },

    login: async (req, res) => {
        // Recuperation des données
        const { identifier, password } = req.validatedData;

        // Récuperation du compte "member" à l'aide du pseudo ou de l'email avec mongoose
        //const member = {pseudo:identifier,email:"test@gmail.com"}
        const logeduser=await UserModel.findOne({ "username":identifier,"email" : req.body.email })
        // Erreur 422, si le member n'existe pas (pseudo ou email invalide)
        if (!logeduser) {
            return res.status(422).json(new ErrorResponse('Bad credential', 422));
        }

        // Si le member existe: Vérification du password via "bcrypt"
        const isValid = await bcrypt.compare(password, logeduser.password);

        // Erreur 422, si le mot de passe ne correspond pas au hashage
        if (!isValid) {
            return res.status(422).json(new ErrorResponse('Bad credential', 422));
        }
       // console.log(`ici les data login ${isValid} ${logeduser}`)
        // Génération d'un « Json Web Token »
        const token = await generateJWT({
            id: logeduser._id,
            pseudo: logeduser.username,
            isAdmin: logeduser.isAdmin
        });

        // Envoi du token
        console.log( logeduser.username +" is logged ")
        res.json(token);
    }
};

module.exports = authController;