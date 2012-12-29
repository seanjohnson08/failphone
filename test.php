<?php

header("Content-type:image/png");
$contents=file_get_contents("failphone/games/1/1306260889.png");
$contents=substr($contents,22);
$contents=base64_decode($contents);

echo $contents;
?>