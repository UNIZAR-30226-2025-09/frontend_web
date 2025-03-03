import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #182028; /* Negro azulado oscuro */
    z-index: 100;
    padding: 10px 0;
`;

const SearchBarContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
`;

const SearchInput = styled.input`
    padding: 10px 20px;
    border: 1px solid #334155; /* Azul oscuro */
    border-radius: 25px;
    width: 300px;
    font-size: 16px;
    background-color: #273444; /* Azul oscuro */
    color: white; /* Texto en blanco */
`;

const PremiumButton = styled.div`
    background-color: #3498db; /* Azul claro */
    color: white; /* Texto en blanco */
    padding: 10px 20px;
    border-radius: 25px;
    font-size: 16px;
    margin-right: 20px;
    cursor: pointer;
`;

const ImageContainer = styled.div`
    display: flex;
    align-items: center;
`;

const CircularImage = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    margin-left: 20px;
`;

const Header = ({ imageUrl1, imageUrl2 }) => {
    return (
        <HeaderContainer>
            <SearchBarContainer>
                <PremiumButton>Hacerse Premium</PremiumButton>
                <SearchInput type="text" placeholder="Buscar..." />
                <ImageContainer>
                    <CircularImage src={imageUrl1} alt="Imagen 1" />
                    <CircularImage src={imageUrl2} alt="Imagen 2" />
                </ImageContainer>
            </SearchBarContainer>
        </HeaderContainer>
    );
};

export default Header;