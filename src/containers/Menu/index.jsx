import { useEffect, useState } from 'react';
import { Container, Banner, CategoryMenu, ProductsContainer   } from './style';
import { api } from '../../services/api';
import { formatPrice } from '../../utils/formatCurrency';
import { CardProduct } from '../../components/CardProduct';

export function Menu() {

    const [categories, setCategories] = useState([]);
    const [products , setProducts] = useState([]);


      useEffect(() => {
          async function loadCategories() {
              const {data} = await api.get('/categories');

              const newCategories = [{ id: 0, name: 'Todas'}, ...data];
  
              setCategories(newCategories);
          }

      
       async function loadProducts() {
                  const {data} = await api.get('/products');
      
                  const newProducts = data.map( (product) => ({
                    currencyValue: formatPrice(product.price),
                     ...product,
                     }));
                  setProducts(newProducts);
              }

              loadCategories();
              loadProducts();
          }, []);

  return (
    

<Container>

        <Banner>
            <h1>O MELHOR
                <br/>
                HAMBURGUER
                <br/>
                ESTA AQUI!

                <span>Esse cardápio está irresistível!</span>
            </h1>
        </Banner>

        <CategoryMenu>

        </CategoryMenu>

        <ProductsContainer>
          { products.map( product => (
            <CardProduct product={product} key={product.id}/>
          ))}
        </ProductsContainer>
    
    </Container>
    
  );
}