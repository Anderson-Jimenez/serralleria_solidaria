import React from 'react';
import { ArrowRight } from 'lucide-react';

function CustomSolutionsSeparator() {
    return (
        <section className='customSolutionsSeparatorSection'>
            <div className='customSolutionsSeparatorSection__content'>
                <h2>Necessites algo especific?</h2>
                <p>Envians una petició personalitzada i et respondrem lo mes aviat possible amb una solució.</p>
            </div>
            <a className='customSolutionsSeparatorSection__cta' href='/solucions_personalitzades'>
                <ArrowRight size={16} />
                Contacta'ns
            </a>
        </section>
    );
}

export default CustomSolutionsSeparator;