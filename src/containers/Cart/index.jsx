import Logo from '../../assets/Logo.svg';
import { CartItems, CartResume } from '../../components';
import { Banner, Container, Content, Title } from './styles';

export function Cart() {
    return(
        <Container>
            <Banner>
                <img src={Logo} alt= 'Logodeuburger'/>
            </Banner>
            <Title>Checkout - Pedido</Title>
            <Content>
                <CartItems/>
                <CartResume/>
            </Content>
        </Container>
    );
}