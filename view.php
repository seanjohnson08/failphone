<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
	<title></title>
    <style type="text/css">
        td{border:1px solid #000;width:200px;height:200px;text-align:center;}
        
    </style>
</head>
<body>
<table>
	<?php
	$stuff=glob("games/".$_GET['game']."/*");
    sort($stuff);
    $stuff=array_chunk($stuff,5);
	foreach($stuff as $instructions) {
        echo "<tr>";
        foreach($instructions as $instruction){
            if(substr($instruction,-3)=="txt") echo '<td>'.file_get_contents($instruction).'</td>';
            else echo '<td><img src="'.file_get_contents($instruction).'" /></td>';
        }
        echo "</tr>";
	}
	?>
</table>
</body>
</html>