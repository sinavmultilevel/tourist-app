class MockPaymentService:
    @staticmethod
    def create_checkout_session(user_id: int, plan_type: str):
        # In a real app, this would talk to Stripe API
        return {
            "session_id": "cs_test_mock_123456",
            "checkout_url": f"https://checkout.stripe.mock/pay?plan={plan_type}&user={user_id}"
        }

    @staticmethod
    def handle_webhook(payload: dict):
        # Verify signature and update user to premium
        return {"status": "success", "event": payload.get("type")}

payment_service = MockPaymentService()
