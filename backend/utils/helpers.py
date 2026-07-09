def format_currency(value: float) -> str:
    """Format float as currency string."""
    return f"₹{value:,.2f}"

def calculate_percentage_change(old_price: float, new_price: float) -> float:
    """Calculate percentage change between two prices."""
    if old_price == 0:
        return 0.0
    return ((new_price - old_price) / old_price) * 100

def get_sentiment_color(recommendation: str) -> str:
    """Get color code for recommendation status."""
    if recommendation.lower() == "buy now":
        return "#4CAF50" # Green
    elif recommendation.lower() == "wait":
        return "#FF9800" # Orange
    return "#9E9E9E" # Grey
