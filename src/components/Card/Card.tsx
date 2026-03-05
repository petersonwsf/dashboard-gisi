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
                <div className="card shadow border-0" style={{minHeight: '200px'}}>
                    <div className="card-body">
                        <div className="d-flex g-3 align-items-center">
                            <img src={image} alt="Imagem" className={styles.image}/>
                            <h5 className="card-title fw-bold mt-3">{title}</h5>
                        </div>
                        <div className="d-flex justify-content-center align-items-center h-50">
                            <h4>{value}</h4>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}