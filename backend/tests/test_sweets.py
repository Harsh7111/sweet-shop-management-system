def test_get_all_sweets(client):
    response = client.get("/api/sweets/")
    assert response.status_code == 200


def test_add_sweet_as_admin(client, admin_user_token):
    response = client.post(
        "/api/sweets/",
        headers={"Authorization": admin_user_token},
        json={
            "name": "Barfi",
            "category": "Milk",
            "price": 15,
            "quantity": 30
        }
    )
    assert response.status_code == 200


def test_update_sweet_as_admin(client, admin_user_token, sample_sweet):
    response = client.put(
        f"/api/sweets/{sample_sweet.id}",
        headers={"Authorization": admin_user_token},
        json={"price": 20.0}
    )
    print(response.json()) 
    assert response.status_code == 200


def test_delete_sweet_as_admin(client, admin_user_token, sample_sweet):
    response = client.delete(
        f"/api/sweets/{sample_sweet.id}",
        headers={"Authorization": admin_user_token}
    )
    assert response.status_code == 200


def test_search_sweets(client, normal_user_token, sample_sweet):
    response = client.get(
        "/api/sweets/search?name=Ladoo",
        headers={"Authorization": normal_user_token}
    )
    assert response.status_code == 200