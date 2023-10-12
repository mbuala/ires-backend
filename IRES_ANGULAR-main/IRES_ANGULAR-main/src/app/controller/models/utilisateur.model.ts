import { Role } from "./role.model";
export class Utilisateur {
    idUtilisateur: number;
      nom: String;
      prenom: String;
      sexe: String;
      dateNaissance: Date;
      telephone: String;
      identifiant: String;
      email: String;
      motDePasse: String;
      adresse: String;
      etatCivil: String;
      cin: String;
      photo: String;
      isConnected:boolean;      
      isLock:boolean;  
      idRole: Role;
      resettoken: String;
      ville :string

     
}
