<?php
if(!is_numeric($_POST['game'])) die();
if($_POST['data']) {
    $o=fopen("games/".$_POST['game']."/".time().'.png','w');
    fwrite($o,$_POST['data']);
    fclose($o);
} else {
    $o=fopen("games/".$_POST['game']."/".time().".txt","w");
    fwrite($o,$_POST['text']);
    fclose($o);
    header("Location:./?game=".$_POST['game']);
}
?>