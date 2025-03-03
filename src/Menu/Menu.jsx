import React from "react";
import Grid from "./Grid/Grid.jsx";
import SidebarLibrary from "./SidebarLibrary/SidebarLibrary.jsx";
import MainContent from "./MainContent/MainContent.jsx"; // Importamos el nuevo componente
import Header from "./Header/Header.jsx";

const Menu = () => {
    return (
        <Grid>
            <Grid.TopBar>
                <Header>

                </Header>
            </Grid.TopBar>
            <Grid.Sidebar>
                <SidebarLibrary />
            </Grid.Sidebar>
            <Grid.MainContent>
                <MainContent /> {/* Se usa el nuevo componente aquí */}
            </Grid.MainContent>
        </Grid>
    );
};

export default Menu;