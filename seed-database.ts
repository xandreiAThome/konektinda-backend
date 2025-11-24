import 'dotenv/config';
import { db } from './database';
import { suppliers } from './db/suppliers/suppliers.schema';
import { product_categories } from './db/products/product_categories.schema';
import { products } from './db/products/products.schema';
import { product_variants } from './db/products/product_variants.schema';

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Seed Suppliers
    console.log('📦 Seeding suppliers...');
    const supplierData = [
      {
        supplier_name: 'Fresh Farms Co.',
        supplier_description:
          'Local organic farm supplying fresh vegetables and fruits',
      },
      {
        supplier_name: 'Premium Produce Ltd.',
        supplier_description: 'High-quality produce supplier for retail chains',
      },
      {
        supplier_name: 'Green Valley Organics',
        supplier_description: 'Certified organic farming cooperative',
      },
      {
        supplier_name: 'Sunrise Dairy',
        supplier_description: 'Premium dairy and milk products supplier',
      },
    ];

    const createdSuppliers = await db
      .insert(suppliers)
      .values(supplierData)
      .returning();
    console.log(`✅ Created ${createdSuppliers.length} suppliers\n`);

    // Seed Product Categories
    console.log('🏷️  Seeding product categories...');
    const categoryData = [
      { category_name: 'Fruits' },
      { category_name: 'Vegetables' },
      { category_name: 'Dairy & Eggs' },
      { category_name: 'Grains & Cereals' },
      { category_name: 'Beverages' },
      { category_name: 'Spices & Seasonings' },
    ];

    const createdCategories = await db
      .insert(product_categories)
      .values(categoryData)
      .returning();
    console.log(`✅ Created ${createdCategories.length} categories\n`);

    // Seed Products
    console.log('🍎 Seeding products...');
    const productData = [
      {
        product_category_id: createdCategories[0].product_category_id, // Fruits
        supplier_id: createdSuppliers[0].supplier_id,
        product_name: 'Organic Apples',
        product_description: 'Fresh, crisp organic apples from local orchards',
        is_active: true,
        product_img: 'https://via.placeholder.com/300x300?text=Apples',
      },
      {
        product_category_id: createdCategories[0].product_category_id, // Fruits
        supplier_id: createdSuppliers[2].supplier_id,
        product_name: 'Bananas',
        product_description: 'Yellow, ripe bananas perfect for smoothies',
        is_active: true,
        product_img: 'https://via.placeholder.com/300x300?text=Bananas',
      },
      {
        product_category_id: createdCategories[1].product_category_id, // Vegetables
        supplier_id: createdSuppliers[1].supplier_id,
        product_name: 'Carrots',
        product_description: 'Sweet, crunchy carrots full of vitamins',
        is_active: true,
        product_img: 'https://via.placeholder.com/300x300?text=Carrots',
      },
      {
        product_category_id: createdCategories[1].product_category_id, // Vegetables
        supplier_id: createdSuppliers[0].supplier_id,
        product_name: 'Tomatoes',
        product_description: 'Farm-fresh red tomatoes, perfect for cooking',
        is_active: true,
        product_img: 'https://via.placeholder.com/300x300?text=Tomatoes',
      },
      {
        product_category_id: createdCategories[2].product_category_id, // Dairy & Eggs
        supplier_id: createdSuppliers[3].supplier_id,
        product_name: 'Fresh Milk',
        product_description: 'Pasteurized fresh milk from grass-fed cows',
        is_active: true,
        product_img: 'https://via.placeholder.com/300x300?text=Milk',
      },
      {
        product_category_id: createdCategories[2].product_category_id, // Dairy & Eggs
        supplier_id: createdSuppliers[3].supplier_id,
        product_name: 'Free-Range Eggs',
        product_description: 'Organic free-range chicken eggs',
        is_active: true,
        product_img: 'https://via.placeholder.com/300x300?text=Eggs',
      },
      {
        product_category_id: createdCategories[3].product_category_id, // Grains & Cereals
        supplier_id: createdSuppliers[2].supplier_id,
        product_name: 'Brown Rice',
        product_description: 'Whole grain brown rice, rich in fiber',
        is_active: true,
        product_img: 'https://via.placeholder.com/300x300?text=Rice',
      },
      {
        product_category_id: createdCategories[4].product_category_id, // Beverages
        supplier_id: createdSuppliers[1].supplier_id,
        product_name: 'Orange Juice',
        product_description: 'Fresh squeezed orange juice',
        is_active: true,
        product_img: 'https://via.placeholder.com/300x300?text=OrangeJuice',
      },
    ];

    const createdProducts = await db
      .insert(products)
      .values(productData)
      .returning();
    console.log(`✅ Created ${createdProducts.length} products\n`);

    // Seed Product Variants
    console.log('📊 Seeding product variants...');
    const variantData = [
      // Apples variants
      {
        product_id: createdProducts[0].product_id,
        variant_name: '1 kg bag',
        stock: 50,
        price: 4.99,
        discount: 0,
        is_active: true,
        product_variant_img:
          'https://via.placeholder.com/300x300?text=Apples+1kg',
      },
      {
        product_id: createdProducts[0].product_id,
        variant_name: '2 kg bag',
        stock: 30,
        price: 8.99,
        discount: 5,
        is_active: true,
        product_variant_img:
          'https://via.placeholder.com/300x300?text=Apples+2kg',
      },
      // Bananas variants
      {
        product_id: createdProducts[1].product_id,
        variant_name: 'Bunch (6 pieces)',
        stock: 100,
        price: 2.99,
        discount: 0,
        is_active: true,
        product_variant_img:
          'https://via.placeholder.com/300x300?text=Bananas+Bunch',
      },
      {
        product_id: createdProducts[1].product_id,
        variant_name: '2 kg bag',
        stock: 60,
        price: 5.99,
        discount: 10,
        is_active: true,
        product_variant_img:
          'https://via.placeholder.com/300x300?text=Bananas+2kg',
      },
      // Carrots variants
      {
        product_id: createdProducts[2].product_id,
        variant_name: '500g pack',
        stock: 80,
        price: 1.99,
        discount: 0,
        is_active: true,
        product_variant_img:
          'https://via.placeholder.com/300x300?text=Carrots+500g',
      },
      {
        product_id: createdProducts[2].product_id,
        variant_name: '1 kg pack',
        stock: 40,
        price: 3.49,
        discount: 8,
        is_active: true,
        product_variant_img:
          'https://via.placeholder.com/300x300?text=Carrots+1kg',
      },
      // Tomatoes variants
      {
        product_id: createdProducts[3].product_id,
        variant_name: '1 kg bag',
        stock: 70,
        price: 3.99,
        discount: 0,
        is_active: true,
        product_variant_img:
          'https://via.placeholder.com/300x300?text=Tomatoes+1kg',
      },
      {
        product_id: createdProducts[3].product_id,
        variant_name: '2 kg bag',
        stock: 35,
        price: 7.49,
        discount: 15,
        is_active: true,
        product_variant_img:
          'https://via.placeholder.com/300x300?text=Tomatoes+2kg',
      },
      // Milk variants
      {
        product_id: createdProducts[4].product_id,
        variant_name: '1 Liter',
        stock: 120,
        price: 2.99,
        discount: 0,
        is_active: true,
        product_variant_img: 'https://via.placeholder.com/300x300?text=Milk+1L',
      },
      {
        product_id: createdProducts[4].product_id,
        variant_name: '2 Liters',
        stock: 80,
        price: 5.49,
        discount: 5,
        is_active: true,
        product_variant_img: 'https://via.placeholder.com/300x300?text=Milk+2L',
      },
      // Eggs variants
      {
        product_id: createdProducts[5].product_id,
        variant_name: '6 pack',
        stock: 150,
        price: 3.99,
        discount: 0,
        is_active: true,
        product_variant_img:
          'https://via.placeholder.com/300x300?text=Eggs+6pack',
      },
      {
        product_id: createdProducts[5].product_id,
        variant_name: '12 pack',
        stock: 100,
        price: 7.49,
        discount: 10,
        is_active: true,
        product_variant_img:
          'https://via.placeholder.com/300x300?text=Eggs+12pack',
      },
      // Rice variants
      {
        product_id: createdProducts[6].product_id,
        variant_name: '1 kg bag',
        stock: 200,
        price: 4.49,
        discount: 0,
        is_active: true,
        product_variant_img:
          'https://via.placeholder.com/300x300?text=Rice+1kg',
      },
      {
        product_id: createdProducts[6].product_id,
        variant_name: '5 kg bag',
        stock: 50,
        price: 19.99,
        discount: 12,
        is_active: true,
        product_variant_img:
          'https://via.placeholder.com/300x300?text=Rice+5kg',
      },
      // Orange Juice variants
      {
        product_id: createdProducts[7].product_id,
        variant_name: '500 ml bottle',
        stock: 90,
        price: 3.49,
        discount: 0,
        is_active: true,
        product_variant_img:
          'https://via.placeholder.com/300x300?text=OJ+500ml',
      },
      {
        product_id: createdProducts[7].product_id,
        variant_name: '1 Liter bottle',
        stock: 60,
        price: 5.99,
        discount: 7,
        is_active: true,
        product_variant_img: 'https://via.placeholder.com/300x300?text=OJ+1L',
      },
    ];

    const createdVariants = await db
      .insert(product_variants)
      .values(variantData)
      .returning();
    console.log(`✅ Created ${createdVariants.length} product variants\n`);

    console.log('✨ Database seeding completed successfully!');
    console.log(`
📊 Summary:
  - ${createdSuppliers.length} suppliers
  - ${createdCategories.length} categories
  - ${createdProducts.length} products
  - ${createdVariants.length} product variants
    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

void seedDatabase();
