<?
header("Content-Type: application/json;charset=utf-8");
echo file_get_contents($_SERVER['DOCUMENT_ROOT'].'/calc-your-weekend/model.json');