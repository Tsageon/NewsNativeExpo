import * as React from 'react';
import { Appbar } from 'react-native-paper';


const Header = () => {
return (
    <Appbar.Header style={{marginTop:10, backgroundColor:'lightgrey', borderRadius:5,}}>
      
      <Appbar.Content style={{}} title="Generic News App" />
      
    </Appbar.Header>
  );
};

export default Header;