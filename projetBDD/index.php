<?php
session_start();
setcookie('page',1);
?>
<head>
<script src="https://code.jquery.com/jquery-3.1.1.min.js%22%3E"> </script>
 </head>
<form action="handler.php" method="POST">

    <fieldset>
        <table style="text-align:right">
            <tr>
                <td>adresse mail:</td>
                <td><input type="text" name="mail" id="mail"></td>
            </tr>
            <tr>
                <td>mot de passe:</td>
                <td><input type="text" name="mdp" id="mdp"></td>
            </tr>
            <tr>
                <td></td><td><input type="submit" value="Connexion"></td>
            </tr>

        </table>
    </fieldset>
</form>

<p><button onclick="location.href='creerCompte.php'" class="button">créer un compte</button></p>
<p><button onclick="location.href='supressionSession.php'" class="button">déconnecté</button></p>


<?php if(!isset($_SESSION['connected']) or $_SESSION['connected']==FALSE){

  echo("Deconnecté");

}else{
  echo("Connecté");

}?>
