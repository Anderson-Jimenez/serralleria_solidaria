import React from 'react';
import { ArrowRight } from 'lucide-react';

function CustomSolutionsSeparator() {
    return (
        <section className='customSolutionsSeparatorSection'>
            <div className='customSolutionsSeparatorSectionContent'>
                <h2>Necessites algo especific?</h2>
                <p>Envians una petició personalitzada i et respondrem lo mes aviat possible amb una solució.</p>
            </div>
            <a className='customSolutionsSeparatorSectionCta' href='/solucions_personalitzades'>
                Escriu una solicitud
            </a>
        </section>
    );
}

export default CustomSolutionsSeparator;