import Link from "next/link";
import styles from "./navigation.module.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface NavData {
    title: string;
    slug: string;
}

interface Props {
    prev?: NavData;
    next?: NavData;
}

interface CardProps extends NavData {
    isPrev?: boolean;
    isNext?: boolean;
}

const _Card = ({ title, slug, isPrev, isNext }: CardProps) => {
    return (
        <Link href={`/blog/${slug}`} className={styles.card}>
            {isPrev && (
                <span className={styles.prevIcon}>
                    <IoIosArrowBack size={32} color="#878787" />
                </span>
            )}

            <span className={styles.cardContent}>
                <h2 className={styles.cardTitle}>{title}</h2>
            </span>

            {isNext && (
                <span className={styles.nextIcon}>
                    <IoIosArrowForward size={32} color="#878787" />
                </span>
            )}
        </Link>
    );
};

export const Navigation = ({ prev, next }: Props) => {
    return (
        <div className={styles.container}>
            {prev && (
                <div className={styles.prev}>
                    <_Card {...prev} isPrev />
                </div>
            )}
            {next && (
                <div className={styles.next}>
                    <_Card {...next} isNext />
                </div>
            )}
        </div>
    );
};
