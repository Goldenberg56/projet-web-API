<?php

  function connexpdo($db)
  {
      $sgbd = "mysql"; // choix de MySQL
      $host = "localhost";
      $charset = "UTF8";
      $user = "root"; // TODO : user id
      $pass = ""; // TODO : password
      try {
          $pdo = new PDO("$sgbd:host=$host;dbname=$db;charset=$charset", $user, $pass);
          $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
          return $pdo;
      } catch (PDOException $e) {
          printPDOException($e);
          exit();
      }
  }

  function printPDOException(PDOEXception $e){
      echo "<div class=\"error\"><p> ERREUR </p>\n<p>".$e->getMessage()."</p></div>";
  }

  function addUtilisateur($mail,$mdp){

    if($mail == Null or $mdp == Null){

      echo "<script type='text/javascript'>alert('champ vide');</script>";
      require("creerCompte.php");
      return -1;
    }

    $pdo = connexpdo("gestionUtilisateurs");
    $qry_addUtilisateur = "INSERT INTO utilisateur(adresse_mail, mdp)  VALUES (?,?)";
    $pdostt_addUtilisateur = $pdo->prepare($qry_addUtilisateur);

    try{

      $r = $pdostt_addUtilisateur->execute([$mail, $mdp]);

    }catch(PDOEXception $e){

      if($e->getCode() == 23000){

        echo"mail déja utilisé";

        require("creerCompte.php");
        return -1;

      }

    }

    if (!$r) {

      echo "<script type='text/javascript'>alert('échec de l'ajout');</script>";
      require("index.php");

    }else{

      echo "<script type='text/javascript'>alert('ajout réussie');</script>";
      require("index.php");

    }
  }

  function getUtilisateur($mail,$mdp){

    $pdo = connexpdo("gestionUtilisateurs");
    $qry_addUtilisateur = "SELECT id FROM utilisateur WHERE adresse_mail = ? AND mdp = ?";
    $pdostt_addUtilisateur = $pdo->prepare($qry_addUtilisateur);
    $pdostt_addUtilisateur->bindParam(1,$mail,PDO::PARAM_STR);
    $pdostt_addUtilisateur->bindParam(2,$mdp,PDO::PARAM_STR);
    $pdostt_addUtilisateur->execute();

    if($pdostt_addUtilisateur->rowCount() ==  0){

      echo "<script type='text/javascript'>alert('compte inexistant');</script>";
      require("index.php");

    }else{

      session_start();
      $_SESSION["connected"]=TRUE;
      echo "<script type='text/javascript'>alert('connexion réussie');</script>";
      require("index.php");

    }
}


if($_COOKIE['page']==1){

  getUtilisateur($_POST['mail'],$_POST['mdp']);

}else if($_COOKIE['page']==2){

  addUtilisateur($_POST['mail'],$_POST['mdp']);
}else{

  require("index.php");

}
?>
