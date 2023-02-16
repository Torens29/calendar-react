import { useCallback, useState } from 'react';
import styles from './Menu.module.css'

const formatterMonth =  new Intl.DateTimeFormat("en", {
        month: "long",
        year: 'numeric'
    }) 

export const Menu = ({onChange})=>{

    const [date,setDate] = useState(new Date());

    const stepNext = useCallback(()=>{
        onChange(new Date(new Date(date).setMonth(date.getMonth()+1)));
        setDate((curDate) =>{
            
            return new Date(new Date(curDate).setMonth(curDate.getMonth()+1))
        })
    },[onChange, date]);


    const stepBack = useCallback(()=>{
            onChange(new Date(new Date(date).setMonth(date.getMonth()-1)))
        setDate((curDate) =>{
            
            return new Date(new Date(curDate).setMonth(curDate.getMonth()-1))
        })
    },[onChange, date]);

   

    
    return (
        <div className={styles.menu}>
            <div className={styles['step_back']} onClick={stepBack}></div>
            <div className={styles["month"]}>{formatterMonth.format(date)}</div>
            <div className={styles["step_next"]} onClick={stepNext}></div>
            
        </div>
    )

    
    
    
        
}