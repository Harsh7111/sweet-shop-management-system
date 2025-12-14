def test_register_user(client):
    response = client.post(
        "/api/auth/register",
        json={
            "username": "Harsh",
            "email": "test@example.com",
            "password": "12345"
        }
    )
    assert response.status_code == 200
    assert response.json()["username"] == "Harsh"


def test_login_user(client, normal_user):
    response = client.post(
        "/api/auth/login",
        json={
            "username": "user1",
            "password": "1234"
        }
    )
    assert response.status_code == 200
    assert "access_token" in response.json()