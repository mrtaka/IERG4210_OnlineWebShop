import React from 'react';
import { useLocation } from 'react-router-dom';

function NoMatch() {
    let location = useLocation();
    return(
      <>
      <h2>There is an error, page {location.pathname} not found!!!</h2>
      </>
    )
}

export default NoMatch;