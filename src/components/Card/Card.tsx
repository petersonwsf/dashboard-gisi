import styles from './Card.module.css'

interface CardProps {
    title: string;
    value: any;
    image: any;
}

export function Card({ title, value, image } : CardProps) {
    return (
        <>
            {value && 
                <div className="card shadow border-0 bg-light" style={{ width: '240px', borderRadius: '15px' }}>
                    <div className="card-body">
                        <div className="d-flex g-3 align-items-center justify-content-center">
                            <img src={image} alt="Imagem" className={styles.image}/>
                            <h5 className="card-title mt-3">{title}</h5>
                        </div>
                        <div className="d-flex justify-content-center align-items-center h-50">
                            <h5 className='text-center'>{value}</h5>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}