import React from 'react';
import { ArrowRight } from 'lucide-react';

function QuiSom() {
    return (
        <section className='quiSom'>
            <h1>Qui Som?</h1>
            <p>
                Grup de professionals de la serralleria i automatismes fundat l'1 d'Abril de 2014. 
                La motivació va ser la vessant solidària, destinant un 10% dels beneficis a projectes solidaris des del primer dia. 
                Col·laboradors amb més de vint anys d'experiència i altres en formació.
                <span>Ens agrada dir que ens dediquem més a tancar que a obrir.</span>
            </p>
            <div className='storeData'>
                <div>
                    <p>1.558 treballs realitzats</p>
                </div>
                <div>
                    <p>1.558 treballs realitzats</p>
                </div>
                <div>
                    <p>95% satisfacció de clients</p>
                </div>
                <div>
                    <p>3.104 € destinats a projectes solidaris</p>
                </div>
            </div>

        </section>
    );
}

export default QuiSom;