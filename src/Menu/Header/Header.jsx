import React from 'react';
import styled from 'styled-components';

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const SearchInput = styled.input`
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 25px;
  width: 300px;
  font-size: 16px;
  margin-right: 20px;
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
  margin-left: 10px;
`;

const Header = ({ imageUrl1, imageUrl2 }) => {
    return (
        <SearchBarContainer>
            <SearchInput type="text" placeholder="Buscar..." />
            <ImageContainer>
                <CircularImage src={imageUrl1} alt="Imagen 1" />
                <CircularImage src={imageUrl2} alt="Imagen 2" />
            </ImageContainer>
        </SearchBarContainer>
    );
};

export default Header;