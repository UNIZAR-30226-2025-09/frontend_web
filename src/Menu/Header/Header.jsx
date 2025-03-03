import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #182028;
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
    border-radius: 25px;
    width: 300px;
    font-size: 16px;
    background-color: #273444;
    color: white;
`;

const PremiumButton = styled.div`
    background-color: #158acd;
    color: white;
    padding: 10px 20px;
    border-radius: 25px;
    font-size: 16px;
    margin-right: 20px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #083aa5;
    }
`;

const ImageContainer = styled.div`
    display: flex;
    align-items: center;
`;

const CircularImageContainer = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    margin-left: 20px;
    background-color: white;
`;

const CircularImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Header = ({ imageUrl1, imageUrl2 }) => {
    return (
        <HeaderContainer>
            <SearchBarContainer>
                <PremiumButton>Hacerse Premium</PremiumButton>
                <SearchInput type="text" placeholder="Buscar..." />
                <ImageContainer>
                    <CircularImageContainer>
                        <CircularImage src={imageUrl1} alt="Imagen 1" />
                    </CircularImageContainer>
                    <CircularImageContainer>
                        <CircularImage src={imageUrl2} alt="Imagen 2" />
                    </CircularImageContainer>
                </ImageContainer>
            </SearchBarContainer>
        </HeaderContainer>
    );
};

export default Header;