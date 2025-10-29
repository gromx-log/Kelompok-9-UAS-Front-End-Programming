import ProductCard from '../components/productCard';

// Data dummy 
const dummyProducts = [
  {
    id: 1,
    name: 'Red Velvet Classic',
    description: 'Kue red velvet lembut dengan cream cheese frosting.',
    price: 'Rp 250.000',
    imageUrl: '/images/cake-placeholder.jpg',
  },
  {
    id: 2,
    name: 'Chocolate Overload',
    description: 'Bagi pecinta cokelat, kue ini penuh dengan ganache.',
    price: 'Rp 300.000',
    imageUrl: '/images/cake-placeholder.jpg',
  },
  {
    id: 3,
    name: 'Unicorn Rainbow Cake',
    description: 'Kue pelangi lucu untuk ulang tahun anak.',
    price: 'Rp 350.000',
    imageUrl: '/images/cake-placeholder.jpg',
  },
];

export default function ProductsPage() {
  return (
    <div className="container my-5 pt-5"> 
      <h1 className="text-center mb-4">Katalog Kue Kami</h1>
      
      <div className="row g-4">
        {dummyProducts.map((product) => (
          <div className="col-md-6 col-lg-4" key={product.id}>
            <ProductCard
              title={product.name}
              description={product.description}
              price={product.price}
              imageUrl={product.imageUrl}
            />
          </div>
        ))}
      </div>
    </div>
  );
}