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