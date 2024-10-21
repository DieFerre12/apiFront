// src/components/Brands.js
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { SiNike } from "react-icons/si";
import { SiAdidas } from "react-icons/si";
import { GiAlliedStar } from "react-icons/gi";
import { SiPuma } from "react-icons/si";
import vans from '../assets/vans.png';

class Brands extends Component {
  render() {
    return (
      <div className="flex justify-center space-x-20 my-4">
        <Link to="/product">
          <SiNike className="h-16 w-auto"/>
        </Link>
        <Link to="/product">
          <SiAdidas className="h-16 w-auto" />
        </Link>
        <Link to="/product">
          <GiAlliedStar className="h-16 w-auto" />
        </Link>
        <Link to="/product">
          <img src={vans} alt="Vans" className="h-16 w-auto" />
        </Link>
        <Link to="/product">
          <SiPuma className="h-16 w-auto" />
        </Link>
        
      </div>
    );
  }
}

export default Brands;
        
