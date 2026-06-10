/**
 * Single source of truth for group categories + sub-categories.
 *
 * BOTH the consumer "Create Group" screen and the admin "Create Group" modal
 * import this, so a group created by a buyer and one created by an admin always
 * use the exact same category vocabulary — no mismatch between the two flows.
 */

export const subCategoryMap = {
  Smartphones: ['All Smartphones', 'iPhone', 'Samsung', 'OnePlus', 'Xiaomi', 'Google Pixel', 'Motorola', 'Realme'],
  Laptops: ['All Laptops', 'MacBook', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI'],
  Appliances: ['All Appliances', 'Refrigerator', 'Washing Machine', 'AC', 'Microwave', 'Dishwasher'],
  Electronics: ['All Electronics', 'Headphones', 'Speakers', 'Cameras', 'Smart Watch', 'Tablet', 'Gaming'],
  Fashion: ['All Fashion', 'Men', 'Women', 'Kids', 'Footwear', 'Accessories', 'Sports'],
  Groceries: ['All Groceries', 'Fruits & Veggies', 'Dairy', 'Snacks', 'Beverages', 'Staples'],
  Furniture: ['All Furniture', 'Sofa', 'Bed', 'Table', 'Chair', 'Storage', 'Décor'],
};

export const mainCategories = [
  { id: 'Smartphones', name: 'Smartphones' },
  { id: 'Laptops', name: 'Laptops' },
  { id: 'Appliances', name: 'Appliances' },
  { id: 'Electronics', name: 'Electronics' },
  { id: 'Fashion', name: 'Fashion' },
  { id: 'Groceries', name: 'Groceries' },
  { id: 'Furniture', name: 'Furniture' },
];

// Flat list of category names — handy for simple <select> dropdowns.
export const categoryNames = mainCategories.map((c) => c.name);

/** Case-insensitive resolver: main category name → its sub-categories. */
export const getSubCategories = (mainCat) => {
  if (!mainCat) return [];
  const key = Object.keys(subCategoryMap).find((k) => k.toLowerCase() === mainCat.toLowerCase());
  return key ? subCategoryMap[key] : [];
};
