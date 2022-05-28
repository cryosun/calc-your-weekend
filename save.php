<?
$res = [];
$res['res'] = file_get_contents('php://input');
if (file_put_contents($_SERVER['DOCUMENT_ROOT'].'/calc-your-weekend/model.json',file_get_contents('php://input'))) {
	$res['res'] = 'ok';
}

header("Content-Type: application/json;charset=utf-8");
echo json_encode($res);