export const restaurants = [
    {
        name: "Dunkin Donuts",
        type: "Restaurant",
        address: "17 Petir Road, Hillion Mall",
        coordinates: { latitude: 1.3786, longitude: 103.7626 },
        foodItems: 4,
        food: [
            { name: "Donut", price: 2, stock: 3, discount: 50 },
            { name: "Coffee", price: 2.50, stock: 6, discount: 60 },
            { name: "Sandwich", price: 5, stock: 3, discount: 70 },
            { name: "Burger", price: 6, stock: 2, discount: 80 }
        ],
        image: require('../assets/dunkin.jpeg'),
        discount: 30
    },
    {
        name: "Bread Talk",
        type: "Bakery",
        address: "Bukit Batok",
        foodItems: 15,
        food: [
            { name: "Floss Bread", price: 2, stock: 10, discount: 30 },
            { name: "Cheese Bread", price: 4, stock: 8, discount: 40 },
            { name: "Pork Floss Bun", price: 6, stock: 3, discount: 70 }
        ],
        image: require('../assets/breadtalk.jpg'),
        discount: 50
    },
    {
        name: "Petir Chicken Rice",
        type: "Restaurant",
        address: "1 Jelebu Road",
        foodItems: 5,
        food: [
            { name: "Chicken Rice", price: 5, stock: 2, discount: 80 },
            { name: "Chicken Chop", price: 3, stock: 5, discount: 60 }
        ],
        image: require('../assets/chickenrice.jpg'),
        discount: 60
    },
    {
        name: "NTUC Fairprice",
        type: "Supermarket",
        address: "Hillion Mall",
        foodItems: 10,
        food: [
            { name: "Rice", price: 6, stock: 5, discount: 40 },
            { name: "Noodles", price: 2, stock: 8, discount: 60 }
        ],
        image: require('../assets/ntuc.png'),
        discount: 50
    }
];