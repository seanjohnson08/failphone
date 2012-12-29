<?php
    if(is_numeric($_GET['game'])&&!is_dir('games/'.$_GET['game'])) mkdir('games/'.$_GET['game']);
    $sofar=glob("games/".$_GET['game']."/*");
    sort($sofar);
    $lastinstruction=array_pop($sofar);
    $ext=array_pop(explode(".",$lastinstruction));
?>
<!DOCTYPE html>
<html>
<head>
<style type='text/css'>
body{background:#CCC;}
canvas{border:1px solid #000;cursor:crosshair;}
.tools{width:40px;padding-left:5px;}
.tools .color,.tools .tool{width:16px;height:16px;border:1px solid #CCC;float:left;margin:1px;}
.eraser{background:url(eraser.png);}
.brush{background:url(brush.png);}
.fill{background:url(fill.png);}
.undo{background:url(undo.png);}
.selected{border-color:#00F !important;}
img{border:1px solid #000;}
</style>
</head>
<body>
<?php
if($ext=="txt") {
?>
    Draw: <?php echo file_get_contents($lastinstruction);?><br />
    <canvas id='draw'>
    </canvas><br />
    <input type='button' onclick='failphone.save(<?php echo $_GET['game'];?>)' value='Save'/>
    <div id='debug'></div>
    <script type='text/javascript' src='js.js'></script>
<?php } else { ?>
        <?php if($lastinstruction) { ?>
        Describe this picture:<br />
        <img src="<?php echo file_get_contents($lastinstruction);?>" />
        <?php } else { ?>
            Type out a description for the other person to draw!<br />
        <?php } ?>
        <form method="post" action="submit.php">
        <input type="hidden" name="game" value="<?php echo $_GET['game']; ?>" />
        Description: <input type="text" name="text" /><br />
        <input type="submit" value="Send" />
        </form>
<?php } ?>
</body>
</html>