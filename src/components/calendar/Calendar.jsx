import styles from "./Calendar.module.css";
import { useMemo, useState, useCallback, useEffect } from "react";
import cn from "classnames";
import { Menu } from "../Menu/Menu";
const equal = require("fast-deep-equal");

const holiday = {
    1.1: "Новый год",
    7.1: "Рождество Христово",
    14.1: "Старый Новый год",
    19.1: "Крещение Господне",
    25.1: "Татьянин день (день студента)",
    31.1: "Международный день ювелира	 ",
    2.2: "День сурка",
    8.2: "День российской науки",
    13.2: "Всемирный день радио",
    14.2: "День святого Валентина (день всех влюбленных)",
    15.2: "Сретение Господне",
    23.2: "День защитника Отечества",
    8.3: "Международный женский день",
    27.3: "День МВД",
    "01.4": "День смеха",
    22.4: "Международный день Земли",
    24.4: "	День секретаря	 ",
    "01.5": "День весны и труда",
};

const Day = ({ className, children, fClick, id, enterMouse, exitMouse }) => {
    return (
        <div
            className={className}
            onClick={fClick}
            id={id}
            onMouseEnter={enterMouse}
            onMouseLeave={exitMouse}
        >
            {children}
        </div>
    );
};

const formatterRange = new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
});

export const Calendar = () => {
    const [date, setDate] = useState(new Date());
    const [selectRange, setSelectRange] = useState({
        firstDay: undefined,
        lastDay: undefined,
    });

    const firstDayOfWeek = useMemo(() => {
        const day = new Date(date.getFullYear(), date.getMonth(), 0).getDay();
        if (day === 0) return 7;
        return day;
    }, [date]);

    const lotDayOfMonth = useMemo(() => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    }, [date]);

    const [coord, setCoord] = useState({ x: 0, y: 0 });

    const handleMouseMove = useCallback((e) => {
        setCoord({ x: e.screenX, y: e.screenY });
    }, []);

    const [discHolid, setDiskHolid] = useState("");

    const discWindow = useMemo(
        () => (
            <div
                className={styles.discr_holid}
                style={{ top: `${coord.y - 100}px`, left: `${coord.x}px` }}
            >
                {discHolid}
            </div>
        ),
        [discHolid, coord]
    );

    const equalObj = (obj) => {
        setSelectRange((prevState) => {
            if (equal(prevState, obj)) return prevState;
            return obj;
        });
    };

    // useEffect(() => {
    //     (async () => {
    //         await fetch("https://htmlweb.ru/service/api.php?holiday&private=0", {
    //             mode: "no-cors",
    //             method: "post",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                  "Access-Control-Allow-Origin": '*',
    //                  "Access-Control-Allow-Credentials" : true
    //             },
    //         })
    //             .then((response) => response.json())
    //             .then((data) => console.log("This is your data", data));
    //     })();
    // }, []);

    let day = 0;

    const flag =
        date.getFullYear() === new Date().getFullYear() &&
        date.getMonth() === new Date().getMonth();
    const curDay = new Date().getDate();

    const select = useCallback(
        (e) => {
            if (selectRange.firstDay === undefined) {
                return equalObj({
                    firstDay: new Date(date.getFullYear(), date.getMonth(), e.target.innerHTML),
                    lastDay: selectRange.lastDay,
                });
            } else if (selectRange.lastDay === undefined) {
                if (
                    new Date(date.getFullYear(), date.getMonth(), e.target.innerHTML) >
                    new Date(selectRange.firstDay)
                ) {
                    equalObj({
                        firstDay: selectRange.firstDay,
                        lastDay: new Date(date.getFullYear(), date.getMonth(), e.target.innerHTML),
                    });
                } else {
                    equalObj({
                        firstDay: new Date(date.getFullYear(), date.getMonth(), e.target.innerHTML),
                        lastDay: selectRange.firstDay,
                    });
                }
            }
        },
        [selectRange, date]
    );

    const displayDiscHol = useCallback(
        (e) => {
            if (e.target.classList.contains(styles.holiday)) {
                setDiskHolid(holiday[e.target.innerHTML + "." + (date.getMonth() + 1)]);
            }
        },
        [date]
    );

    const hiddenDiscHol = useCallback(() => {
        setDiskHolid("");
    }, []);

    const items = Array(49)
        .fill(0)
        .map((e, i) => {
            if (i >= firstDayOfWeek && i < lotDayOfMonth + firstDayOfWeek) {
                if (flag && curDay === day + 1) {
                    return (
                        <Day
                            enterMouse={displayDiscHol}
                            exitMouse={hiddenDiscHol}
                            fClick={select}
                            className={cn(
                                styles.calendar__weeksDay_item,
                                styles.calendar__weeks_item,
                                styles.color_lBlue,
                                new Date(selectRange.firstDay).getDate() === day + 1 &&
                                    styles.select,
                                new Date(selectRange.lastDay).getDate() === day + 1 && styles.select
                            )}
                            key={i}
                            id={i}
                        >
                            {++day}
                        </Day>
                    );
                } else {
                    return (
                        <Day
                            enterMouse={displayDiscHol}
                            exitMouse={hiddenDiscHol}
                            fClick={select}
                            className={cn(
                                styles.calendar__weeksDay_item,
                                styles.calendar__weeks_item,
                                styles.color_turquoise,
                                selectRange.firstDay !== undefined &&
                                    new Date(selectRange.firstDay).getDate() === day + 1 &&
                                    new Date(selectRange.firstDay).getMonth() === date.getMonth() &&
                                    new Date(selectRange.firstDay).getFullYear() ===
                                        date.getFullYear() &&
                                    styles.select,
                                selectRange.lastDay !== undefined &&
                                    new Date(selectRange.lastDay).getDate() === day + 1 &&
                                    new Date(selectRange.lastDay).getMonth() === date.getMonth() &&
                                    new Date(selectRange.lastDay).getFullYear() ===
                                        date.getFullYear() &&
                                    styles.select,
                                new Date(selectRange.firstDay) <
                                    new Date(date.getFullYear(), date.getMonth(), day + 1) &&
                                    new Date(selectRange.lastDay) >
                                        new Date(date.getFullYear(), date.getMonth(), day + 1) &&
                                    styles.select_range,

                                holiday[day + 1 + "." + (date.getMonth() + 1)] !== undefined &&
                                    styles.holiday
                            )}
                            key={i}
                            id={i}
                        >
                            {++day}
                        </Day>
                    );
                }
            } else
                return (
                    <Day
                        fClick={select}
                        className={cn(styles.calendar__weeksDay_item, styles.calendar__weeks_item)}
                        key={i}
                        id={i}
                    ></Day>
                );
        });

    const reset = useCallback(() => {
        setDate(new Date());
    }, []);

    return (
        <>
            <Menu onChange={setDate} />
            <button onClick={reset}>reset</button>
            <div className={styles.calendar} onMouseMove={handleMouseMove}>
                <Day className={styles.calendar__weeksDay_name}>пн</Day>
                <Day className={styles.calendar__weeksDay_name}>вт</Day>
                <Day className={styles.calendar__weeksDay_name}>ср</Day>
                <Day className={styles.calendar__weeksDay_name}>чт</Day>
                <Day className={styles.calendar__weeksDay_name}>пт</Day>
                <Day className={styles.calendar__weeksDay_name}>сб</Day>
                <Day className={styles.calendar__weeksDay_name}>вс</Day>
                {items}
            </div>
            <br />
            <div>
                FirstDay: {JSON.stringify(formatterRange.format(selectRange.firstDay))} -{" "}
                {JSON.stringify(formatterRange.format(selectRange.lastDay))} :LastDay
            </div>
            {discWindow}
        </>
    );
};
