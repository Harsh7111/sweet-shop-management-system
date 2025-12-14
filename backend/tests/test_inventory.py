def test_purchase_sweet(client, normal_user_token, sample_sweet):
    response = client.post(
        f"/api/sweets/{sample_sweet.id}/purchase",
        headers={"Authorization": normal_user_token}
    )
    assert response.status_code == 200


def test_restock_sweet_admin(client, admin_user_token, sample_sweet):
    response = client.post(
        f"/api/sweets/{sample_sweet.id}/restock?quantity=5",
        headers={"Authorization": admin_user_token}
    )
    assert response.status_code == 200