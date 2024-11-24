import React from 'react';
import { Link } from 'react-router-dom';

const Butt = ({to, children}) => {
  return (
        <Link to={to} className="text-white hover:text-gray-300">
          {children}
        </Link>
     
  );
};

export default Butt;
