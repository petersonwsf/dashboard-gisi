import { useState } from 'react';
import { CARGOS, ESCOLARIDADE, SETORES } from '../../assets/consts/consts'

import styles from './Filtros.module.css'

interface FiltrosProps {
    filtros: {
        sexo?: string[];
        escolaridade?: string[];
        cargo?: string[];
        setor?: string[];
    }
    setFiltros: (filtros: FiltrosProps['filtros']) => void;
}

export default function Filtros({ filtros, setFiltros }: FiltrosProps) {

    const [internalFiltros, setInternalFiltros] = useState<FiltrosProps['filtros']>(filtros);

    const handleChangeFiltros = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'sexo') {
            setInternalFiltros(prev => {
                const currentValue = value;
                if (prev.sexo?.includes(currentValue)) return { ...prev, sexo: [] };
                return { ...prev, sexo: currentValue ? [currentValue] : [] };
            });
            return
        }

        if (internalFiltros[name as keyof FiltrosProps['filtros']] !== undefined) {
            const filterAlreadySelected = internalFiltros[name as keyof FiltrosProps['filtros']]?.includes(value);
            if (filterAlreadySelected) {
                const newValues = internalFiltros[name as keyof FiltrosProps['filtros']]?.filter(v => v !== value);
                setInternalFiltros(prev => ({ ...prev, [name]: newValues }));
            } else {
                const newValues = [...(internalFiltros[name as keyof FiltrosProps['filtros']] || []), value];
                setInternalFiltros(prev => ({ ...prev, [name]: newValues }));
            }
        }
    }

    const aplicarFiltros = () => {
        setFiltros(internalFiltros)
    }

    return (
        <div className={`${styles.filtros} my-3 shadow px-4 py-3 bg-light`} style={{ width: '300px', borderRadius: '10px'}}>
            <h5 className='mb-3'>Filtros</h5>
            <div className='w-100 my-2'>
                <h6>Sexo</h6>
                <div className='form-check'>
                    <input className='form-check-input' type='checkbox' id='sexo-masculino' name='sexo' checked={internalFiltros.sexo?.includes('Masculino')} value='Masculino' onChange={handleChangeFiltros} />
                    <label className='form-check-label' htmlFor='sexo-masculino'>
                        Masculino
                    </label>
                </div>
                <div className='form-check'>
                    <input className='form-check-input' type='checkbox' id='sexo-feminino' name='sexo' checked={internalFiltros.sexo?.includes('Feminino')} value='Feminino' onChange={handleChangeFiltros} />
                    <label className='form-check-label' htmlFor='sexo-feminino'>
                        Feminino
                    </label>
                </div>
            </div>

            <div className='w-100 my-2'>
                <h6>Cargo</h6>
                <div className='mt-2'>
                    {CARGOS.map(cargo => (
                        <div className='form-check' key={cargo.nome}>
                            <input className='form-check-input' type='checkbox' id={`cargo-${cargo.nome}`} name='cargo' value={cargo.nome} onChange={handleChangeFiltros} />
                            <label className='form-check-label' htmlFor={`cargo-${cargo.nome}`}>
                                {cargo.nome}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            <div className='w-100 my-2'>
                <h6>Setor</h6>
                <div className='mt-2'>
                    {SETORES.map(setor => (
                        <div className='form-check' key={setor.nome}>
                            <input className='form-check-input' type='checkbox' id={`setor-${setor.nome}`} name='setor' value={setor.nome} onChange={handleChangeFiltros} />
                            <label className='form-check-label' htmlFor={`setor-${setor.nome}`}>
                                {setor.nome}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            <div className='w-100 my-2'>
                <h6>Escolaridade</h6>
                <div className='mt-2'>
                    {ESCOLARIDADE.map(escolaridade => (
                        <div className='form-check' key={escolaridade.nome}>
                            <input className='form-check-input' type='checkbox' id={`escolaridade-${escolaridade.nome}`} name='escolaridade' value={escolaridade.nome} onChange={handleChangeFiltros} />
                            <label className='form-check-label' htmlFor={`escolaridade-${escolaridade.nome}`}>
                                {escolaridade.nome}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            <div className='w-100 mt-4 text-center'>
                <button className='btn btn-primary' onClick={aplicarFiltros} >Aplicar filtros</button>
            </div>
        </div>
    )
}