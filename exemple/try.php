<?php
$rep = ['response'=>false];
if($_GET['data']=='true')
  $rep['response']=true;
header('Content-Type: application/json; charset=utf-8');
echo json_encode($rep);
?>
