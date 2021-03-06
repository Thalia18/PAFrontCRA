import React from 'react';
import './EstilosError.scss';
import { Link } from 'react-router-dom';

class Error extends React.Component {
  render() {
    return (
      <div className='ContainerErrorScss'>
        <div className='ContainerErrorNoise'></div>
        <div className='ContainerErrorOverlay'></div>
        <div className='ContainerErrorTerminal'>
          <h1>
            Error <span className='ContainerErrorcode'>404</span>
          </h1>
          <br />
          <p className='ContainerErrorOutput'>
            La página que está buscando fue movida, removida, renombrada o
            probablemente nunca existió.
          </p>
          <p className='ContainerErrorOutput'>
            Por favor intente{' '}
            <Link className='ContainerErrorA' to='/'>
              Regresar a la página de inicio
            </Link>{' '}
            .
          </p>
          <p className='ContainerErrorOutput'>Buena suerte.</p>
        </div>
      </div>
    );
  }
}

export default Error;
