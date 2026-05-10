import React from 'react';
import { ArrowRight } from 'lucide-react';

function QuiSom() {
    return (
        <section className='quiSom'>
            

            <div className='quiSomMainLayout'>
                <div className='storeInfo'>
                    <div className='storeInfoTitle'>
                        <h2 className='quiSomLabel'>La Nostra Empresa</h2>
                        <h1 className='quiSomTitle'>Qui <span>Som</span></h1>
                        <div className="quiSomDivider" />
                    </div>
                    <p>
                        Grup de professionals de la serralleria i 
                        automatismes fundat l'1 d'Abril de 2014. 
                        La motivació va ser la vessant solidària,
                        destinant un 10% dels beneficis a projectes 
                        solidaris des del
                        primer dia. <br />
                        <br />
                        Col·laboradors amb més de vint anys 
                        d'experiència i altres en formació,
                        provocant un creixement i millora 
                        qualitativa reflectida en les ressenyes 
                        dels nostres clients.<br />
                        <br />
                        <span className='coolSentence'>"Ens agrada dir que ens dediquem més a tancar que a obrir."</span>
                    </p>
                </div>

                <div className='quiSomData'>
                    <div className='quiSomStat'>
                        <div className='quiSomStatNum'>1.558</div>
                        <div className='quiSomStatText'>Treballs <br /> realitzats</div>
                    </div>
                    <div className='quiSomStat'>
                        <div className='quiSomStatNum'>98%</div>
                        <div className='quiSomStatText'>Atenció <br /> post-venda</div>
                    </div>
                    <div className='quiSomStat'>
                        <div className='quiSomStatNum'>95%</div>
                        <div className='quiSomStatText'>satisfacció <br /> de clients</div>
                    </div>
                    <div className='quiSomStat'>
                        <div className='quiSomStatNum'>3.104 €</div>
                        <div className='quiSomStatText'>destinats a projectes solidaris</div>
                    </div>
                </div>
            </div>


        </section>
    );
}

export default QuiSom;