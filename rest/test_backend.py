#!.venv/bin/python
import sqlite3

import pytest
from passlib.apache import HtpasswdFile

import backend

AUTH = ("tester", "secret")


@pytest.fixture()
def client(tmp_path, monkeypatch):
    db_path = tmp_path / "checkpoints.sqlite3"
    ht_path = tmp_path / ".htpasswd"
    monkeypatch.setattr(backend, "DB_PATH", str(db_path))
    monkeypatch.setattr(backend, "HTPASSWD_PATH", str(ht_path))

    with sqlite3.connect(str(db_path)) as conn:
        conn.execute(
            "CREATE TABLE checkpoints ("
            "id INTEGER PRIMARY KEY AUTOINCREMENT, "
            "tag VARCHAR, state VARCHAR, prev VARCHAR)"
        )

    ht = HtpasswdFile(str(ht_path), new=True)
    ht.set_password(*AUTH)
    ht.save()

    monkeypatch.setattr(backend, "AUTH_ENABLED", True)
    backend.app.config.update(TESTING=True)
    return backend.app.test_client()


def rows():
    with sqlite3.connect(backend.DB_PATH) as conn:
        return conn.execute(
            "SELECT tag, state, prev FROM checkpoints ORDER BY id"
        ).fetchall()


def test_list_empty(client):
    rv = client.get("/")
    assert rv.status_code == 200
    assert rv.get_json() == {}


def test_share_and_list(client):
    rv = client.post("/*share", json={"tag": "a", "state": "1", "prev": "0"}, auth=AUTH)
    assert rv.status_code == 200
    assert rv.get_json() == {"tag": "a", "state": "1", "prevstate": "0"}
    assert rows() == [("a", "1", "0")]

    rv = client.get("/")
    assert rv.status_code == 200
    assert rv.get_json() == {"a": {"tag": "a", "state": "1", "prevstate": "0"}}


def test_share_conflict(client):
    client.post("/*share", json={"tag": "a", "state": "1", "prev": "0"}, auth=AUTH)
    rv = client.post("/*share", json={"tag": "a", "state": "2", "prev": "0"}, auth=AUTH)
    assert rv.status_code == 409


def test_share_requires_auth(client):
    assert client.post("/*share", json={"tag": "x", "state": "1", "prev": "0"}).status_code == 401
    rv = client.post(
        "/*share", json={"tag": "x", "state": "1", "prev": "0"}, auth=("tester", "wrong")
    )
    assert rv.status_code == 401


def test_auth_disabled_share(client, monkeypatch):
    monkeypatch.setattr(backend, "AUTH_ENABLED", False)
    rv = client.post("/*share", json={"tag": "x", "state": "1", "prev": "0"})
    assert rv.status_code == 200
    assert rv.get_json() == {"tag": "x", "state": "1", "prevstate": "0"}


def test_auth_disabled_reset(client, monkeypatch):
    monkeypatch.setattr(backend, "AUTH_ENABLED", False)
    rv = client.get("/*reset")
    assert rv.status_code == 200
    assert rv.get_json() == {"result": "DB RESET"}


def test_get_checkpoint(client):
    client.post("/*share", json={"tag": "a", "state": "5", "prev": "3"}, auth=AUTH)
    rv = client.get("/a")
    assert rv.status_code == 200
    assert rv.get_json() == {"tag": "a", "state": "5", "prevstate": "3"}


def test_get_missing(client):
    rv = client.get("/doesnotexist")
    assert rv.status_code == 404


def test_update_checkpoint(client):
    client.post("/*share", json={"tag": "a", "state": "5", "prev": "3"}, auth=AUTH)
    rv = client.post("/a", json={"state": "2"}, auth=AUTH)
    assert rv.status_code == 200
    assert rv.get_json() == {"state": "7"}
    assert rows() == [("a", "7", "3")]


def test_update_missing(client):
    rv = client.post("/doesnotexist", json={"state": "1"}, auth=AUTH)
    assert rv.status_code == 404


def test_update_requires_auth(client):
    client.post("/*share", json={"tag": "a", "state": "1", "prev": "0"}, auth=AUTH)
    assert client.post("/a", json={"state": "2"}).status_code == 401


def test_put_always_400(client):
    rv = client.put("/a")
    assert rv.status_code == 400
    assert rv.get_json() == {"message": "User updated successfully"}

    rv = client.put("/")
    assert rv.status_code == 400


def test_reset(client):
    client.post("/*share", json={"tag": "a", "state": "1", "prev": "0"}, auth=AUTH)
    rv = client.get("/*reset", auth=AUTH)
    assert rv.status_code == 200
    assert rv.get_json() == {"result": "DB RESET"}
    assert client.get("/").get_json() == {}


def test_reset_requires_auth(client):
    assert client.get("/*reset").status_code == 401


def test_delete_requires_auth(client):
    client.post("/*share", json={"tag": "a", "state": "1", "prev": "0"}, auth=AUTH)
    rv = client.delete("/a", json={"password": "x"})
    assert rv.status_code == 401


def test_delete_missing(client):
    rv = client.delete("/doesnotexist", json={"password": "x"}, auth=AUTH)
    assert rv.status_code == 404


def test_delete_wrong_password(client):
    client.post("/*share", json={"tag": "a", "state": "1", "prev": "0"}, auth=AUTH)
    rv = client.delete("/a", json={"password": "wrong"}, auth=AUTH)
    assert rv.status_code == 401
    assert rows() == [("a", "1", "0")]

if __name__ == "__main__":
    import pytest
    pytest.main(["-v"])
