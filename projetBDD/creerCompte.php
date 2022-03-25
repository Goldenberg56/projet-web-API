<?php
session_start();
setcookie('page',2);
?>

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
                <td></td><td><input type="submit" value="Créer"></td>
            </tr>

        </table>
    </fieldset>
</form>

<p><button onclick="location.href='index.php'" class="button">retour</button></p>
<?php if(!isset($_SESSION['connected'])){

  echo("Deconnecté");

}else{
  echo("Connecté");

}?>
