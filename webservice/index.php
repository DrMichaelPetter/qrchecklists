<?php

$db = new SQLite3('db/checkpoints.sqlite3', SQLITE3_OPEN_CREATE | SQLITE3_OPEN_READWRITE);


// https://marketplace.visualstudio.com/items?itemName=humao.rest-client
//header("HTTP/1.1 502 Bad Gateway");
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE');

$method = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : $method;
$input = json_decode(file_get_contents('php://input'), true);
$url = explode("/",trim(substr($_SERVER['PATH_INFO'],strlen("/index.php/"))," "));


switch ($method) {
    case 'GET':    handleGet($url,$db);            break;
    case 'POST':   handlePost($url, $input,$db);   break;
    case 'PUT':    handlePut($url, $input);        break;
    case 'DELETE': handleDelete($url, $input,$db); break;
    case 'OPTIONS':header('HTTP/1.1 200 OK');      break;
    default:
        echo json_encode(['message' => " [$method] method not supported"]);
        break;
}



// https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
function handleGet($url,$db) {
    if (count($url) == 1) {
        if ($url[0] == '') {
            echo listCheckpoints($db);
        } elseif ($url[0] == '*reset') {
            resetCheckpoints($db);
            echo json_encode(['result' => "DB RESET"]);
        }else {
            if (!isTag($url[0],$db)) {
                http_response_code(404); exit;
            } else {
                echo getCheckpoint($url[0],$db);
            }
        }
    } else {
        header("HTTP/1.1 400 Bad Request");
    }
}

function handlePost($url, $input, $db) {
    if (count($url) == 1) {
        if ($url[0] == '*share') {
            echo shareCheckpoint($input["tag"],$input["state"],$input["prev"],$db);
            return;
        } else {
            if (!isTag($url[0],$db)) {
                http_response_code(404); return;
            } else {
                $update = new \stdClass();
                $update->tag  = $input["tag"];
                $update->state= $input["state"];
                echo updateCheckpoint($url[0],$update,$db);
                return;
            }
        }
    } else {
        header("HTTP/1.1 400 Bad Request");
    }
}

function handlePut($url, $input) {
    header("HTTP/1.1 400 Bad Request");
    echo json_encode(['message' => 'User updated successfully']);
}

function handleDelete($url, $input,$db) {
    if(count($url)==1){
        if (!isTag($url[0],$db)){
           http_response_code(404); return;
        } else {
          $password=$input["password"];
          $hash=hash('sha256',$password);
          if (!($hash == 'd7dbaf19d9827ff39ac45e9ac5b2a8275577bb94c2556d22b2c6a1736ba8f1db')) {
             http_response_code(401);return;
          }
          deleteTag($url[0],$db);         
        }
    } else {
      header("HTTP/1.1 400 Bad Request");
    }
    echo json_encode(['message' => 'User deleted successfully']);
}

function isTag($tag,$db){
    $result=$db->query("SELECT COUNT(tag) FROM checkpoints WHERE tag='".$tag."'");
    $array=$result->fetchArray();
    return $array[0]>0;
}

function resetCheckpoints($db){
    $db->exec('BEGIN');
    $db->query('DROP TABLE IF EXISTS "checkpoints"');
    $db->query('CREATE TABLE IF NOT EXISTS "checkpoints" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        "tag" VARCHAR,
        "state" VARCHAR,
        "prev" VARCHAR
    )');
    $db->exec('COMMIT');
}
// sqlite3 checkpoints.sqlite3 "delete from checkpoints where tag='test'"
function deleteTag($tag,$db){
    $db->query("DELETE FROM checkpoints WHERE tag='".$tag."'");
}

// sqlite3 checkpoints.sqlite3 "select tag,state,prev from checkpoints"
function listCheckpoints($db){
    $checkpoints=array();
    $db->exec('BEGIN');
    $result = $db->query('SELECT "tag","state","prev" FROM "checkpoints"');
    while ($array=$result->fetchArray()) {
        $item=new \stdClass();
        $item->tag      =$array[0];
        $item->state    =$array[1];
        $item->prevstate=$array[2];
        $checkpoints[$item->tag]=$item;
    }
    $db->exec('COMMIT');
    return json_encode($checkpoints);
}
function getCheckpoint($checkpointHandle,$db){
    $result = $db->query('SELECT "tag","state","prev" FROM "checkpoints" WHERE "tag"="'.$checkpointHandle.'"');
    $array=$result->fetchArray();
    $item=new \stdClass();
    $item->tag      =$array[0];
    $item->state    =$array[1];
    $item->prevstate=$array[2];
    return json_encode($item);
}

function shareCheckpoint($tag,$state,$prev,$db){
    $db->exec('BEGIN');
    if (isTag($tag,$db)) {
        http_response_code(409); 
        $db->close();
        exit;
    }
    $db->exec('INSERT INTO "checkpoints" ("tag", "state", "prev") VALUES ("'.$tag.'", "'.$state.'", "'.$prev.'")');
    $db->exec('COMMIT');
    $item=new \stdClass();
    $item->tag      =$tag;
    $item->state    =$state;
    $item->prevstate=$prev;
    return json_encode($item);
}
function updateCheckpoint($checkpointHandle,$value,$db){
    $db->exec('BEGIN');
    $result = $db->query('SELECT "tag","state","prev" FROM "checkpoints" WHERE "tag"="'.$checkpointHandle.'"');
    $array=$result->fetchArray();
    $item=new \stdClass();
    $item->tag      =$array[0];
    $item->state    =$array[1];
    $item->prevstate=$array[2];

    $oldvalue=$item->state;
    $newval = gmp_strval(gmp_or($value->state,$oldvalue),10);
    $db->query('UPDATE "checkpoints" SET "state"="'.$newval.'" WHERE "tag"="'.$checkpointHandle.'"');
    $db->exec('COMMIT');
    return json_encode(['state' => $newval]);
}


$db->close();

?>
